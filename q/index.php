<?php
function armory($char, $realm = 'Aggramar', $loc = 'eu', $search = false) {
    global $target;
    if ('eu' != strtolower($loc) && '' != $loc) {
        $loc = 'www';
    } else {
        $loc = 'eu';
    }
    if ('' == $realm) $realm = 'Aggramar';
    $out = sprintf($target['arm'], $char, $realm, $loc);
    #var_dump($out);
    return $out;
}
function armorySearch($char, $loc = 'eu') {
    global $target;
    if ('eu' != strtolower($loc) && '' != $loc) {
        $loc = 'www';
    } else {
        $loc = 'eu';
    }
    $out = sprintf($target['arms'], $char, $loc);
    #var_dump($out);
    return $out;
}
function qarmory($char, $realm = 'Aggramar', $loc = 'eu') {
    global $target;
    if ('eu' != strtolower($loc) && '' != $loc) {
        $loc = '';
    } else {
        $loc = 'EU-';
    }
    if ('' == $realm) $realm = 'Aggramar';
    $out = sprintf($target['qarm'], $char, $loc . $realm);
    return $out;
}

function armorylite($char, $realm = 'aggramar', $loc = 'eu') {
        global $target;
        if ('eu' != strtolower($loc) && '' != $loc) {
                $loc = 'us';
        } else {
                $loc = 'eu';
        }
        if ('' == $realm) $realm = 'aggramar';
        $out = sprintf($target['arml'], $loc , $realm, $char);
        return $out;
}


$target = array(
'du'   => 'http://www.duden.de/suchen/dudenonline/%s',
'bugs' => 'http://bugs.php.net/search.php?search_for=&boolean=1&limit=All&order_by=&direction=ASC&cmd=display&status=All&php_os=&phpver=&assign=&author_email=&bug_age=7',
'iz'   => 'http://izlude.de/%s',
'ip'   => 'http://ip.f5n.de',
'pdo'  => 'http://packages.debian.org/%s',
'suse' => 'http://software.opensuse.org/search?q=%s',
'pear' => 'http://pear.php.net/package/%s',
'wh'   => 'http://www.wowhead.com/?search=%s',
'ww'   => 'http://wowpedia.org/%s',
'wp'   => 'http://de.wikipedia.org/wiki/%s',
'wpe'  => 'http://en.wikipedia.org/wiki/%s',
'wpm'  => 'http://wikipedia.7val.com/wiki/%s',
'd'    => 'http://dict.leo.org/?search=%s',
'dit'  => 'http://dict.leo.org/itde?search=%s',
'des'  => 'http://dict.leo.org/esde?search=%s',
'dfr'  => 'http://dict.leo.org/frde?search=%s',
'dch'  => 'http://dict.leo.org/chde?search=%s',
's'    => 'https://encrypted.google.com/search?hl=de&q=%s',
'imdbg'=> 'http://german.imdb.com/find?q=%s',
'imdb' => 'http://www.imdb.com/find?q=%s',
'arm'  => 'http://%3$s.battle.net/wow/en/character/%2$s/%1$s/advanced',
'arma' => 'http://%3$s.battle.net/wow/en/character/%2$s/%1$s/advanced',
'arms' => 'http://%2$s.battle.net/wow/en/search?q=%1$s',
'armq' => 'http://quickarmory.com/?n=%1$s&r=%2$s',
'arml' => 'http://armorylite.com/%s/%s/%s',
'yt'   => 'http://www.youtube.com/results?search_query=%s&search=Search',
'wr'   => 'http://www.warcraftrealms.com/search.php?serverid=-1&raceid=-1&classid=-1&minlevel=10&maxlevel=80&search=%s&Submit1=SEARCH',
'wa'   => 'http://www.wolframalpha.com/input/?i=%s',
'mvn'  => 'http://search.maven.org/#search%%7Cga%%7C1%%7C%s',
'p'    => 'http://php.net/%s',
'help' => 'http://q.f5n.de'
);
ksort($target);
$base = 'http://q.f5n.de';

$s = urldecode($_SERVER['REQUEST_URI']);
$s = explode(' ', $s);
$p = substr($s[0],1);

if ('/' == $s[0]) {
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>quicktionary</title>
</head>
<body>
<?php
}
if ('/' == $s[0]) {
    echo "<pre>\n";
    foreach($target as $k => $v) {
        $url = parse_url($v);
        $x = $url['host'];
        if(strpos($x,'%') !== false) {
            $y = split('\.', $x);
            $tld = array_pop($y);
            $y = array_reverse($y);
            foreach($y as $y) {
                if(strpos($y,'%') === false) {
                    $tld = $y.".".$tld;
                }
            }
        } else {
            $tld = $x;
        }
        if ('help' != $k) echo str_pad($k, 10).' => <a href="'.$url['scheme'].'://'.$tld.'">'.$tld."</a>\n";
    }
    echo "</pre>\n";
} else if (array_key_exists(strtolower($p), $target)) {
    if ('arm' == $p) {
        $out = armory($s[1],$s[2],$s[3]);
    } elseif ('arma' == $p) {
        $out = armory($s[1],'chamber-of-aspects',$s[3]);
    } elseif ('arms' == $p) {
        $out = armorySearch($s[1],$s[2]);
    } elseif ('qarm' == $p) {
        $out = qarmory($s[1],$s[2], $s[3]);
    } elseif ('arml' == $p) {
        $out = armorylite($s[1],$s[2], $s[3]);
    } else {
        unset($s[0]);
        $out = sprintf($target[$p], join(' ',$s));
    }
    header('Referer: http://'.$base);
    header('Location: '.$out);
    exit();
}
?>
<p><a href="http://validator.w3.org/check?uri=referer">Valid XHTML 1.0</a></p>
</body>
</html>
