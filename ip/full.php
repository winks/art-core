<?php
$parts = explode('.', $_SERVER['HTTP_HOST']);
if (in_array($parts[0], array('ip', 'ip6', 'ipv4', 'ipv6'))) {
    header('Content-type: text/plain');
    $ip = preg_replace('([^0-9a-fA-F:\.])', '', $_SERVER['REMOTE_ADDR']);
    if (isset($_REQUEST['help']) || '/help' == $_SERVER['REQUEST_URI']) {
        echo "Displays the ip address you're connecting from" . PHP_EOL;
        echo "" . PHP_EOL;
        echo "/help or ?help         - show this help" . PHP_EOL;
        echo "/ptr  or ?ptr          - show reverse dns" . PHP_EOL;
        echo "?ts=1234               - show ISO 8601 date for unix timestamp 1234" . PHP_EOL;
        echo "?ts=1234&f=Y           - show ISO 8601 date for timestamp and format according to php.net/date" . PHP_EOL;
        echo "?d=2006-05-04T11:12:13 - show unix timestamp for ISO 8601 date, assumes UTC" . PHP_EOL;
    } else if (isset($_REQUEST['ptr']) || '/ptr' == $_SERVER['REQUEST_URI']) {
        $ptr = gethostbyaddr($ip);
        echo (false === $ptr) ? $ip : $ptr;
    } else if (isset($_REQUEST['ts'])) {
        $ts = $_REQUEST['ts'];
        $ts = preg_replace('([^0-9]+)', '', $ts);
        $ts = intval($ts);
        if ($ts < 1 &&  strlen($_REQUEST['ts']) < 1) { $ts = time(); }
        $fmt = 'c';
        if (isset($_REQUEST['f'])) {
            $fmt = $_REQUEST['f'];
        }
        $r = gmdate($fmt, $ts);
        if (false === $r) { $r = gmdate('c', $ts); }
        echo $r;
    } else if (isset($_REQUEST['d'])) {
        preg_match('((\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*)', $_REQUEST['d'], $m);
        $r = gmmktime($m[4], $m[5], $m[6], $m[2], $m[3], $m[1]);
        echo $r;
    } else {
        echo $ip;
    }
    echo PHP_EOL;
    exit();
} else {
?>
<!DOCTYPE html><html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><title>info</title></head><body><pre>
<?php
    $x = array(
        'REMOTE_ADDR',
        'HTTP_USER_AGENT',
        'HTTP_ACCEPT',
        'HTTP_ACCEPT_LANGUAGE',
        'HTTP_ACCEPT_ENCODING',
        'HTTP_ACCEPT_CHARSET',
        'HTTP_CONNECTION',
        'REQUEST_METHOD',
        'HTTP_REFERER',
        'HTTP_HOST',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED_HOST',
        'SERVER_PROTOCOL',
        'SCRIPT_NAME',
        'REQUEST_URI',
        'PATH_TRANSLATED',
    );
    foreach($x as $x) {
        if (isset($_SERVER[$x])) {
            $y = str_pad($x, 21);
            $h = str_pad('Hostname', 21);
            $value = $_SERVER[$x];
            printf('%s: %s' . PHP_EOL, $y, $value);
            if ('REMOTE_ADDR' == $x) {
                printf('%s: %s'.PHP_EOL, $h, gethostbyaddr($value));
            }
        }
    }
    if (strtolower(getenv('HTTPS')) == 'on') {
        $y = str_pad('SSL', 21);
        printf(
            '%s: %s (%s %sbit %s %s)',
            $y,
            getenv('SSL_PROTOCOL'),
            getenv('SSL_CIPHER'),
            getenv('SSL_CIPHER_USEKEYSIZE'),
            getenv('SSL_SERVER_S_DN'),
            getenv('SSL_TLS_SNI')
        ) . PHP_EOL;

    }
    echo '</pre></body></html>';
}
