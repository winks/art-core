var ds_session = "user@host"
var ds_port    = "22"
var ds_options = "-batch -q"
var ds_target  = "/home/user/temp/"
var ds_pscp    = "c:\\Apps\\putty\\pscp.exe"

copyit(ds_session,ds_port,ds_options,ds_target,ds_pscp);

function _e(arg) {
	var DEBUG = false;
	if (DEBUG) {
		WScript.Echo(arg);
	}
}

function copyit(ds_session,ds_port,ds_options,ds_target,ds_pscp) {
	_e(">COPYIT");
	
	var iArgs = WScript.Arguments.length;
	if (iArgs == 0 ) {
		WScript.Echo ( "no argument given" );
		WScript.Quit(1);
	}
	var sFileName = WScript.Arguments.Item(0);
	
	var sCommand = ds_pscp + " -P " + ds_port + " " + ds_options + ' "' + sFileName + '" ' + ds_session + ":" + ds_target;
	var sStatus  = 'copied "' + sFileName + '" to ' + ds_session + ':' + ds_port;
	
	_e(sCommand);
	var shell = WScript.CreateObject ("WScript.Shell");
	shell.run(sCommand, 0, true);
	
	WScript.echo(sStatus);
	_e("<COPYIT");
}