#lang web-server/insta

(struct post (title body))

(define BLOG
  (list (post "t1" "b1")
        (post "t2" "b2")))

(define (render-post a-post)
  `(div ((class "post")) 
        ,(post-title a-post)
        (p ,(post-body a-post))))

(define (render-posts a-blog)
  `(div ((class "posts"))
        ,@(map render-post a-blog)))

(define (render-greeting a-name request)
  (response/xexpr
   `(html
     (head (title "Welcome"))
     (body (p ,(string-append "Hello " a-name))))))

(define (render-blog-page a-blog request)
  (response/xexpr
   `(html
     (head (title "My blog"))
     (body (h1 "My blog")
           ,(render-posts a-blog)
           (form
            (input ((name "title")))
            (input ((name "body")))
            (input ((type "submit"))))))))

(define (start request)
  (local [(define a-blog
            (cond [(can-parse-post? (request-bindings request))
                   (cons (parse-post (request-bindings request))
                         BLOG)]
                  [else
                   BLOG]))]
    (render-blog-page a-blog request)))

(define (can-parse-post? bindings)
  (and (exists-binding? 'title bindings)
       (exists-binding? 'body bindings)))

(define (parse-post bindings)
  (post (extract-binding/single 'title bindings)
        (extract-binding/single 'body bindings)))

