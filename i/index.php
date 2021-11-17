<?php
$parts = explode('.', $_SERVER['HTTP_HOST']);
if (in_array($parts[0], array('ip', 'ip6', 'ipv4', 'ipv6'))) {
    $headers = getallheaders();
    $content_type = 'Content-type: text/plain';
    $json = false;
    foreach($headers as $hk => $hv) {
        if (strtolower($hk) == 'accept-type' && strtolower($hv) == 'application/json') {
            $content_type = 'Content-type: application/json';
            $json = true;
            break;
        }
    }
    header($content_type);
    $ip = preg_replace('([^0-9a-fA-F:\.])', '', $_SERVER['REMOTE_ADDR']);
    if (isset($_REQUEST['help']) || '/help' == $_SERVER['REQUEST_URI']) {
        echo "Displays the ip address you're connecting from" . PHP_EOL;
        echo "" . PHP_EOL;
        echo "?help                  - show this help" . PHP_EOL;
        echo "?ptr                   - show reverse dns" . PHP_EOL;
        echo "?ts=1234               - show ISO 8601 date for unix timestamp 1234" . PHP_EOL;
        echo "?ts=1234&f=Y           - show ISO 8601 date for timestamp and format according to php.net/date" . PHP_EOL;
        echo "?d=2006-05-04T11:12:13 - show unix timestamp for ISO 8601 date, assumes UTC" . PHP_EOL;
        echo "?hex=1234              - show hexadecimal value for 1234" . PHP_EOL;
        echo "?dec=1234              - show decimal value for 1234" . PHP_EOL;
        echo "?bin=1234              - show binary value for 1234" . PHP_EOL;
    } else if (isset($_REQUEST['ptr']) || '/ptr' == $_SERVER['REQUEST_URI']) {
        $ptr = gethostbyaddr($ip);
        $rv = (false === $ptr) ? $ip : $ptr;
        if ($json) {
            echo json_encode(['result' => $rv, 'ip' => $ip]);
        } else {
            echo $rv;
        }
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
    } else if (isset($_REQUEST['hex'])) {
        $rv = dechex($_REQUEST['hex']);
        if ($json) {
            echo json_encode(['result' => $rv]);
        } else {
            echo $rv;
        }
    } else if (isset($_REQUEST['dec'])) {
        $rv = hexdec($_REQUEST['dec']);
        if ($json) {
            echo json_encode(['result' => $rv]);
        } else {
            echo $rv;
        }
    } else if (isset($_REQUEST['bin'])) {
        $rv = decbin($_REQUEST['bin']);
        if ($json) {
            echo json_encode(['result' => $rv]);
        } else {
            echo $rv;
        }
    } else if (isset($_REQUEST['d'])) {
        preg_match('((\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).*)', $_REQUEST['d'], $m);
        $rv = gmmktime($m[4], $m[5], $m[6], $m[2], $m[3], $m[1]);
        if ($json) {
            echo json_encode(['result' => $rv]);
        } else {
            echo $rv;
        }
    } else {
        if ($json) {
            echo json_encode(['result' => $ip]);
        } else {
            echo $ip;
        }
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
