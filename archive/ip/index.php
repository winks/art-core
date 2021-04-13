<?php
header('Content-type: text/plain');
$ip = preg_replace('([^0-9a-fA-F:\.])', '', $_SERVER['REMOTE_ADDR']);
if (isset($_REQUEST['ptr']) || '/ptr' == $_SERVER['REQUEST_URI']) {
    $ptr = gethostbyaddr($ip);
    echo (false === $ptr) ? $ip : $ptr;
} else {
    echo $ip;
}
echo PHP_EOL;
exit();
