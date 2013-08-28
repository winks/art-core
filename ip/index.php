<?php
header('Content-type: text/html');

$x = array(
'REMOTE_ADDR', 
);
foreach($x as $x) {
    if (isset($_SERVER[$x])) {
        $y = str_pad($x, 21);
        $h = str_pad('Hostname', 21);
        $value = $_SERVER[$x];
        printf('%s'.PHP_EOL, $value);
        if ('REMOTE_ADDR' == $x) {
#            printf('%s: %s'.PHP_EOL, $h, gethostbyaddr($value));
        }
    }
}
?>
