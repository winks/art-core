#lang racket
(require web-server/page
         web-server/servlet
         web-server/servlet-env)

(struct record (charid charname corpid corpname
                shipid shipname shiptypeid shiptypename
                stationid stationname
                solarsystemid solarsystemname
                constellationid constellationname 
                regionid regionname serverip))

(define ALL
  '())

(define (render-record record)
  `(div ((class "record")) 
    (p ,(record-charname record) " [",(record-corpname record)"]")
    (p ,(record-solarsystemname record) " < " ,(record-constellationname record) " < " ,(record-regionname record))))

(define (render-records all)
  `(div ((class "records"))
        ,@(map render-record all)))

(define (listify x)
  (let ([k (symbol->string (car x))]
        [v (cdr x)])
    (cond [(and (>= (string-length k) 4)
                (string=? (substring k 0 4) "eve_")) `(li ,(string-replace k #rx"^eve_" "") ": " ,v)]
          [else `(li "censored")])))

(define (listify2 x)
  `(li ,(symbol->string (car x)) ,(cdr x)))

(define (render-r-page all request)
  (response/xexpr
   `(html
     (head (title "Eve-Foo"))
     (body (h1 "Eve-Foo")
           ,(render-records all)
           ,(cond [(get-binding 'debug request)
                   `(ul ,@(map listify (request-headers request)))]
                  [else ""])))))

(define (start request)
  (local [(define all
            (cond [(can-parse-headers? (request-headers/raw request))
                   (cons (parse-headers (request-headers/raw request))
                         ALL)]
                  [else
                   ALL]))]
    (render-r-page all request)))

(define (can-parse-headers? headers)
  (and (headers-assq* #"eve_trusted" headers)
       (headers-assq* #"eve_charname" headers)))

(define (parse-headers headers)
  (record (get-val #"eve_charid" headers)
          (get-val #"eve_charname" headers)
          (get-val #"eve_corpid" headers)
          (get-val #"eve_corpname" headers)
          (get-val #"eve_shipid" headers)
          (get-val #"eve_shipname" headers)
          (get-val #"eve_shiptypeid" headers)
          (get-val #"eve_shiptypename" headers)
          (get-val #"eve_stationid" headers)
          (get-val #"eve_stationname" headers)
          (get-val #"eve_solarsystemid" headers)
          (get-val #"eve_solarsystemname" headers)
          (get-val #"eve_constellationid" headers)
          (get-val #"eve_constellationname" headers)
          (get-val #"eve_regionid" headers)
          (get-val #"eve_regionname" headers)
          (get-val #"eve_serverip" headers)))

(define (get-val val headers)
  (bytes->string/utf-8 (header-value (headers-assq* val headers))))

(serve/servlet start
               #:port 3000
               #:listen-ip #f
               #:command-line? #t
               #:servlet-path "/eve")