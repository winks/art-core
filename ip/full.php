<?php
$parts = explode('.', $_SERVER['HTTP_HOST']);
if (in_array($parts[0], array('ip', 'ip6', 'ipv4', 'ipv6'))) {
    header('Content-type: text/plain');
    $ip = preg_replace('([^0-9a-fA-F:\.])', '', $_SERVER['REMOTE_ADDR']);
    if (isset($_REQUEST['help']) || '/help' == $_SERVER['REQUEST_URI']) {
        echo "Displays the ip address you're connecting from" . PHP_EOL;
        echo "" . PHP_EOL;
        echo "/ptr  or ?ptr  - show reverse dns" . PHP_EOL;
        echo "/help or ?help - show this help" . PHP_EOL;
    } else if (isset($_REQUEST['ptr']) || '/ptr' == $_SERVER['REQUEST_URI']) {
        $ptr = gethostbyaddr($ip);
        echo (false === $ptr) ? $ip : $ptr;
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
    echo '</pre></body></html>';
}
