var dropSCP = new dropSCP();
dropSCP.copyit();

function dropSCP()  {
	// this is either a registry-saved session or user@host.example.org
	this.ds_session = "my_session"
	// non-default port needs to be specified anyway, even if it's in the session
	this.ds_port    = "22"
	// put the path to key here as -i C:\\path\\to\\key if not using a session
	this.ds_options = "-batch -q"
	// this is the folder where stuff is saved
	this.ds_target  = "/home/user/tmp/"
	// path to the pscp binary
	this.ds_pscp    = "c:\\Apps\\putty\\pscp.exe"

	this._e = function(arg) {
		var DEBUG = false;
		if (DEBUG) {
			WScript.Echo(arg);
		}
	}

	this.copyit = function() {
		this._e(">COPYIT");
		
		var iArgs = WScript.Arguments.length;
		if (iArgs == 0 ) {
			WScript.Echo ( "no argument given" );
			WScript.Quit(1);
		}
		var sFileName = WScript.Arguments.Item(0);
		
		var sCommand = this.ds_pscp + " -P " + this.ds_port + " " + this.ds_options + ' "' + sFileName + '" ' + this.ds_session + ":" + this.ds_target;
		var sStatus  = 'copied "' + sFileName + '" to ' + this.ds_session + ':' + this.ds_port;
		
		this._e(sCommand);
		var shell = WScript.CreateObject ("WScript.Shell");
		shell.run(sCommand, 0, true);
		
		WScript.echo(sStatus);
		this._e("<COPYIT");
	}
}