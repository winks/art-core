/*
 * dropToPath.js v0.1 - Upload files via syncthing (implicitly), needs clip.exe
 *   written in 2017 by Florian Anderiasch, fa at art dash core dot org, WTFPL licensed or whatever
 *
 * HOWTO:
 * - put this somewhere
 * - change this.url and this.target
 * - create a shortcut in %APPDATA%\Microsoft\Windows\SendTo
 * - right click on a file, choose Send To -> dropToPath.js
 * - voila, file is in the folder (which is hopefully synced) and you have the url in your clipboard
 *
 * I can't believe I have to still script Windows like this today
 */

var dropToPath = new dropToPath();
dropToPath.copyit();

function dropToPath()  {
    // this is where it will end up online
    this.url = "http://example.org/tmp";
    // path to the syncthing "source" folder
    this.target = "C:\\sync\\tmp";

    this._e = function(arg) {
        var DEBUG = false;
        if (DEBUG) {
            WScript.Echo(arg);
        }
    }

    this.copyit = function() {
        var iArgs = WScript.Arguments.length;
        if (iArgs == 0 ) {
            WScript.Echo ( "no argument given" );
            WScript.Quit(1);
        }
        var sFilePath = WScript.Arguments.Item(0);
        var sFileName = this.strip(sFilePath);

        var sCommand = 'cmd.exe /c copy ' + sFilePath + ' ' + this.target + '\\' + sFileName;
        var sClip = 'cmd.exe /c echo|set /p="' + this.url + '/' + sFileName + '" | %systemroot%\\system32\\clip.exe';

        this._e(sCommand);
        this._e(sClip);

        var shell = WScript.CreateObject("WScript.Shell");
        shell.run(sCommand, 0, true);
        shell.run(sClip, 0, true);
    }

    this.strip = function(sPath) {
        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var sFileName = fso.GetFileName(sPath);

        return sFileName;
    }
}
