#!/usr/bin/php
<?php
/**
 * colorize a .patch file, takes a file on the commandline, writes to stdout
 * 
 */
$infile = isset($argv[1]) ? realpath($argv[1]) : false;
$contents = file($infile);

$colors = array(
    'head' => '4be04b',
    'plus' => '51f2f2',
    'minus'=> '980098',
    'line' => 'd6d428',
);

$span = '<span style="background-color:%s">%s</span>';

echo '<span style="font-family: monospace;">' . PHP_EOL;

foreach($contents as $k => $line) {
    $line = trim($line);
    $fi = substr($line, 0, 1);
    $line2 = str_replace(' ', '&nbsp;', $line);

    switch ($fi) {
        case '+':
            if (substr($line, 0, 3) == '+++') {
                $line2 = sprintf($span, $colors['head'], $line2);
            } else {
                $line2 = sprintf($span, $colors['plus'], $line2);
            }
            break;
        case '-':
            if (substr($line, 0, 3) == '---') {
                $line2 = sprintf($span, $colors['head'], $line2);
            } else {
                $line2 = sprintf($span, $colors['minus'], $line2);
            }
            break;
        case '@':
            if (substr($line, 0, 3) == '@@ ') {
                $line2 = sprintf($span, $colors['line'], $line2);
                break;
            }
        default:
            if (substr($line, 0, 7) == 'Index: ') {
                $line2 = sprintf($span, $colors['head'], $line2);
                break;
            }
    }

    echo $line2.'<br />'.PHP_EOL;

}
echo '</span>' . PHP_EOL;
