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
        echo "?ascii                 - show ascii values" . PHP_EOL;
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
    } else if (isset($_REQUEST['ascii'])) {
       $a = <<<TEXT
Char  Dec  Oct  Hex | Char  Dec  Oct  Hex | Char  Dec  Oct  Hex | Char Dec  Oct   Hex
-------------------------------------------------------------------------------------
(nul)   0 0000 0x00 | (sp)   32 0040 0x20 | @      64 0100 0x40 | `      96 0140 0x60
(soh)   1 0001 0x01 | !      33 0041 0x21 | A      65 0101 0x41 | a      97 0141 0x61
(stx)   2 0002 0x02 | "      34 0042 0x22 | B      66 0102 0x42 | b      98 0142 0x62
(etx)   3 0003 0x03 | #      35 0043 0x23 | C      67 0103 0x43 | c      99 0143 0x63
(eot)   4 0004 0x04 | $      36 0044 0x24 | D      68 0104 0x44 | d     100 0144 0x64
(enq)   5 0005 0x05 | %      37 0045 0x25 | E      69 0105 0x45 | e     101 0145 0x65
(ack)   6 0006 0x06 | &      38 0046 0x26 | F      70 0106 0x46 | f     102 0146 0x66
(bel)   7 0007 0x07 | '      39 0047 0x27 | G      71 0107 0x47 | g     103 0147 0x67
(bs)    8 0010 0x08 | (      40 0050 0x28 | H      72 0110 0x48 | h     104 0150 0x68
(ht)    9 0011 0x09 | )      41 0051 0x29 | I      73 0111 0x49 | i     105 0151 0x69
(nl)   10 0012 0x0a | *      42 0052 0x2a | J      74 0112 0x4a | j     106 0152 0x6a
(vt)   11 0013 0x0b | +      43 0053 0x2b | K      75 0113 0x4b | k     107 0153 0x6b
(np)   12 0014 0x0c | ,      44 0054 0x2c | L      76 0114 0x4c | l     108 0154 0x6c
(cr)   13 0015 0x0d | -      45 0055 0x2d | M      77 0115 0x4d | m     109 0155 0x6d
(so)   14 0016 0x0e | .      46 0056 0x2e | N      78 0116 0x4e | n     110 0156 0x6e
(si)   15 0017 0x0f | /      47 0057 0x2f | O      79 0117 0x4f | o     111 0157 0x6f
(dle)  16 0020 0x10 | 0      48 0060 0x30 | P      80 0120 0x50 | p     112 0160 0x70
(dc1)  17 0021 0x11 | 1      49 0061 0x31 | Q      81 0121 0x51 | q     113 0161 0x71
(dc2)  18 0022 0x12 | 2      50 0062 0x32 | R      82 0122 0x52 | r     114 0162 0x72
(dc3)  19 0023 0x13 | 3      51 0063 0x33 | S      83 0123 0x53 | s     115 0163 0x73
(dc4)  20 0024 0x14 | 4      52 0064 0x34 | T      84 0124 0x54 | t     116 0164 0x74
(nak)  21 0025 0x15 | 5      53 0065 0x35 | U      85 0125 0x55 | u     117 0165 0x75
(syn)  22 0026 0x16 | 6      54 0066 0x36 | V      86 0126 0x56 | v     118 0166 0x76
(etb)  23 0027 0x17 | 7      55 0067 0x37 | W      87 0127 0x57 | w     119 0167 0x77
(can)  24 0030 0x18 | 8      56 0070 0x38 | X      88 0130 0x58 | x     120 0170 0x78
(em)   25 0031 0x19 | 9      57 0071 0x39 | Y      89 0131 0x59 | y     121 0171 0x79
(sub)  26 0032 0x1a | :      58 0072 0x3a | Z      90 0132 0x5a | z     122 0172 0x7a
(esc)  27 0033 0x1b | ;      59 0073 0x3b | [      91 0133 0x5b | {     123 0173 0x7b
(fs)   28 0034 0x1c | <      60 0074 0x3c | \      92 0134 0x5c | |     124 0174 0x7c
(gs)   29 0035 0x1d | =      61 0075 0x3d | ]      93 0135 0x5d | }     125 0175 0x7d
(rs)   30 0036 0x1e | >      62 0076 0x3e | ^      94 0136 0x5e | ~     126 0176 0x7e
(us)   31 0037 0x1f | ?      63 0077 0x3f | _      95 0137 0x5f | (del) 127 0177 0x7f
TEXT;
       echo $a;
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
