<!DOCTYPE html><html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><title>info</title></head><body><pre>
<?php
header('Content-type: text/html');

$x = array(
'REMOTE_ADDR',
'HTTP_USER_AGENT',
'HTTP_ACCEPT',
'HTTP_ACCEPT_LANGUAGE',
'HTTP_ACCEPT_ENCODING',
'HTTP_ACCEPT_CHARSET',
'REQUEST_METHOD',
'HTTP_REFERER',
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
        printf('%s: %s'.PHP_EOL, $y, $value);
        if ('REMOTE_ADDR' == $x) {
            printf('%s: %s'.PHP_EOL, $h, gethostbyaddr($value));
        }
    }
}
?>
</pre></body></html>
