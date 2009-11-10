/*
 * dropPOST.js v 0.2 - Upload files via SendTo
 * (c) 2009 Florian Anderiasch, fa at art dash core dot org
 * BSD-licensed, where applicable
 *     for BinaryFile, Base64 and sha1 credits look below
 *
 * == Installation on the client ==
 * - save anywhere on your hard disk
 * - edit the first line, the one with postit(...)
 *   - first argument is the URL to POST to
 *   - second argument is your secret authentication token
 * - put into your SendTo
 *   - Windows 7: Start -> Run -> shell:sendto and place a Shortcut there
 *   - Windows XP: place a Shortcut into Users\YOURNAMEHERE\SendTo or something
 * == Installation on the server ==
 * - put a script to the aforementioned URL that handles uploads
 * - check for your secret authentication token or anyone can upload stuff
 * - PHP example, probably insecure:
 <?php
 if (isset($_POST['dropPostToken']) && $_POST['dropPostToken'] == sha1("YOURTOKENHERE")) {
       // strip everything not alphanumeric or . - _
       $filename = preg_replace('([^a-zA-Z0-9\._-])', '_', $_FILES['dropPostPayload']['name']);
       
       $path = './files/'.$filename;
       move_uploaded_file($_FILES['dropPostPayload']['tmp_name'], $path);
       $x = base64_decode(file_get_contents($path));
       file_put_contents($path, $x);
 }
 ?>
  * changelog:
  *		* v0.1 	- initial commit
  *		* v0.2 	- added sha1
  *				- mocked getType() for now
  */
var mypass = hex_sha1("asdf");
postit("http://example.org/upload/", mypass);

function _e(arg) {
	var DEBUG = false;
	if (DEBUG) {
		WScript.Echo(arg);
	}
}

function getExt(sPath) {
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var sExtName = fso.GetExtensionName(sPath);
	
	return sExtName;
}

function getType(sExt) {
	var sType = "";
	sExt = sExt.toLowerCase();
	if (sExt == "jpg") {
		sType = "image/jpeg";
	} else if (sExt == "png") {
		sType = "image/png";
	} else if (sExt == "txt") {
		sType = "text/plain";
	} else if (sExt == "xml") {
		sType = "text/xml";
	}
	
	//return sType;
	return "application/octet-stream";
}

function buildMIME(sFileName, sBoundary, sName, bAttach) {
	var sAll = "";
	var sCRLF = "\r\n";
	
	var sType = getType(getExt(sFileName));
	
	var sTrans = "Content-Transfer-Encoding: base64";
	var sContentDisp = "Content-Disposition: form-data; name=\"" + sName + "\"";
	var sContentType = "";
	
	if (bAttach) {
		sContentDisp += "; filename=\"" + sFileName + "\"";
		sContentType = "Content-Type: " + sType + sCRLF + sCRLF;
	} else {
		sContentDisp += sCRLF;
	}
	
	sAll = "--" + sBoundary + sCRLF + sTrans + sCRLF + sContentDisp + sCRLF + sContentType;
	return sAll;
}

function postit(sUrl, sToken) {
	_e(">POSTIT");
	
	var sFileName = WScript.Arguments.Item(0);

	var base64 = new Base64();
	
	var sMime = "";
	var sBody = "";
	var sBoundary = "";
	var sH1 = "";
	var sH2 = 0;
	
	var filenameTimestamp = (new Date().getTime());
	
	sBoundary = "MYBOUNDARY-" + filenameTimestamp;
	//sBoundary = "---------------------------154921649918175";
	
	var sFile = new BinaryFile(sFileName);
	var sData = base64.encode(sFile.ReadAll());
	
	sMime += buildMIME("", sBoundary, "dropPostToken", false);
	sMime += sToken + "\r\n";
	sMime += buildMIME(sFileName, sBoundary, "dropPostPayload", true);
	sBody = sMime + sData + "\r\n" + "--" + sBoundary + "--" + "\r\n\r\n";
	
	sH1 = "multipart/form-data; boundary=" + sBoundary;
	sH2 = sBody.length;
	
	_e("Content-type: " + sH1);
	_e("Content-length: " + sH2);
	_e(sBody);
	
	//var req = new ActiveXObject("Microsoft.XMLHTTP");
	var req = new ActiveXObject("Msxml2.XMLHTTP.3.0");
	req.open("POST", sUrl, false);
	req.setRequestHeader("Content-Type", sH1);
	req.setRequestHeader("Content-Length", sH2);
	req.send(sBody);
	
	_e("<POSTIT");
}

/** This is a fairly well optimized object which alows
  * access to binary files from JScript on a Windows
  * operating system.
  *
  * A the end of the file is small set of tests to show how it
  * is used.  You will require ADODB 2.5 or higher installed.
  * this will be so on most 2000 machines and all XP or higher
  * machines.
  *
  * CopyRight: Dr Alexander J Turner - all rights reserved.
  * Please feel free to use this code in any way you like
  * as long as you place a reference in the comments that
  * I wrote it.
  */
function BinaryFile(name)
{
    var adTypeBinary = 1 
    var adTypeText   = 2 
    var adSaveCreateOverWrite = 2
    // The trick - this is the 'old fassioned' not translation page

    // It lest javascript use strings to act like raw octets

    var codePage='437';
   
    this.path=name;
   
    var forward  = new Array();
    var backward = new Array();
   
    // Note - for better performance I should preconvert these hex

    // definitions to decimal - at some point :-) - AJT

    forward['80'] = '00C7';
    forward['81'] = '00FC';
    forward['82'] = '00E9';
    forward['83'] = '00E2';
    forward['84'] = '00E4';
    forward['85'] = '00E0';
    forward['86'] = '00E5';
    forward['87'] = '00E7';
    forward['88'] = '00EA';
    forward['89'] = '00EB';
    forward['8A'] = '00E8';
    forward['8B'] = '00EF';
    forward['8C'] = '00EE';
    forward['8D'] = '00EC';
    forward['8E'] = '00C4';
    forward['8F'] = '00C5';
    forward['90'] = '00C9';
    forward['91'] = '00E6';
    forward['92'] = '00C6';
    forward['93'] = '00F4';
    forward['94'] = '00F6';
    forward['95'] = '00F2';
    forward['96'] = '00FB';
    forward['97'] = '00F9';
    forward['98'] = '00FF';
    forward['99'] = '00D6';
    forward['9A'] = '00DC';
    forward['9B'] = '00A2';
    forward['9C'] = '00A3';
    forward['9D'] = '00A5';
    forward['9E'] = '20A7';
    forward['9F'] = '0192';
    forward['A0'] = '00E1';
    forward['A1'] = '00ED';
    forward['A2'] = '00F3';
    forward['A3'] = '00FA';
    forward['A4'] = '00F1';
    forward['A5'] = '00D1';
    forward['A6'] = '00AA';
    forward['A7'] = '00BA';
    forward['A8'] = '00BF';
    forward['A9'] = '2310';
    forward['AA'] = '00AC';
    forward['AB'] = '00BD';
    forward['AC'] = '00BC';
    forward['AD'] = '00A1';
    forward['AE'] = '00AB';
    forward['AF'] = '00BB';
    forward['B0'] = '2591';
    forward['B1'] = '2592';
    forward['B2'] = '2593';
    forward['B3'] = '2502';
    forward['B4'] = '2524';
    forward['B5'] = '2561';
    forward['B6'] = '2562';
    forward['B7'] = '2556';
    forward['B8'] = '2555';
    forward['B9'] = '2563';
    forward['BA'] = '2551';
    forward['BB'] = '2557';
    forward['BC'] = '255D';
    forward['BD'] = '255C';
    forward['BE'] = '255B';
    forward['BF'] = '2510';
    forward['C0'] = '2514';
    forward['C1'] = '2534';
    forward['C2'] = '252C';
    forward['C3'] = '251C';
    forward['C4'] = '2500';
    forward['C5'] = '253C';
    forward['C6'] = '255E';
    forward['C7'] = '255F';
    forward['C8'] = '255A';
    forward['C9'] = '2554';
    forward['CA'] = '2569';
    forward['CB'] = '2566';
    forward['CC'] = '2560';
    forward['CD'] = '2550';
    forward['CE'] = '256C';
    forward['CF'] = '2567';
    forward['D0'] = '2568';
    forward['D1'] = '2564';
    forward['D2'] = '2565';
    forward['D3'] = '2559';
    forward['D4'] = '2558';
    forward['D5'] = '2552';
    forward['D6'] = '2553';
    forward['D7'] = '256B';
    forward['D8'] = '256A';
    forward['D9'] = '2518';
    forward['DA'] = '250C';
    forward['DB'] = '2588';
    forward['DC'] = '2584';
    forward['DD'] = '258C';
    forward['DE'] = '2590';
    forward['DF'] = '2580';
    forward['E0'] = '03B1';
    forward['E1'] = '00DF';
    forward['E2'] = '0393';
    forward['E3'] = '03C0';
    forward['E4'] = '03A3';
    forward['E5'] = '03C3';
    forward['E6'] = '00B5';
    forward['E7'] = '03C4';
    forward['E8'] = '03A6';
    forward['E9'] = '0398';
    forward['EA'] = '03A9';
    forward['EB'] = '03B4';
    forward['EC'] = '221E';
    forward['ED'] = '03C6';
    forward['EE'] = '03B5';
    forward['EF'] = '2229';
    forward['F0'] = '2261';
    forward['F1'] = '00B1';
    forward['F2'] = '2265';
    forward['F3'] = '2264';
    forward['F4'] = '2320';
    forward['F5'] = '2321';
    forward['F6'] = '00F7';
    forward['F7'] = '2248';
    forward['F8'] = '00B0';
    forward['F9'] = '2219';
    forward['FA'] = '00B7';
    forward['FB'] = '221A';
    forward['FC'] = '207F';
    forward['FD'] = '00B2';
    forward['FE'] = '25A0';
    forward['FF'] = '00A0';
    backward['C7']   = '80';
    backward['FC']   = '81';
    backward['E9']   = '82';
    backward['E2']   = '83';
    backward['E4']   = '84';
    backward['E0']   = '85';
    backward['E5']   = '86';
    backward['E7']   = '87';
    backward['EA']   = '88';
    backward['EB']   = '89';
    backward['E8']   = '8A';
    backward['EF']   = '8B';
    backward['EE']   = '8C';
    backward['EC']   = '8D';
    backward['C4']   = '8E';
    backward['C5']   = '8F';
    backward['C9']   = '90';
    backward['E6']   = '91';
    backward['C6']   = '92';
    backward['F4']   = '93';
    backward['F6']   = '94';
    backward['F2']   = '95';
    backward['FB']   = '96';
    backward['F9']   = '97';
    backward['FF']   = '98';
    backward['D6']   = '99';
    backward['DC']   = '9A';
    backward['A2']   = '9B';
    backward['A3']   = '9C';
    backward['A5']   = '9D';
    backward['20A7'] = '9E';
    backward['192']  = '9F';
    backward['E1']   = 'A0';
    backward['ED']   = 'A1';
    backward['F3']   = 'A2';
    backward['FA']   = 'A3';
    backward['F1']   = 'A4';
    backward['D1']   = 'A5';
    backward['AA']   = 'A6';
    backward['BA']   = 'A7';
    backward['BF']   = 'A8';
    backward['2310'] = 'A9';
    backward['AC']   = 'AA';
    backward['BD']   = 'AB';
    backward['BC']   = 'AC';
    backward['A1']   = 'AD';
    backward['AB']   = 'AE';
    backward['BB']   = 'AF';
    backward['2591'] = 'B0';
    backward['2592'] = 'B1';
    backward['2593'] = 'B2';
    backward['2502'] = 'B3';
    backward['2524'] = 'B4';
    backward['2561'] = 'B5';
    backward['2562'] = 'B6';
    backward['2556'] = 'B7';
    backward['2555'] = 'B8';
    backward['2563'] = 'B9';
    backward['2551'] = 'BA';
    backward['2557'] = 'BB';
    backward['255D'] = 'BC';
    backward['255C'] = 'BD';
    backward['255B'] = 'BE';
    backward['2510'] = 'BF';
    backward['2514'] = 'C0';
    backward['2534'] = 'C1';
    backward['252C'] = 'C2';
    backward['251C'] = 'C3';          
    backward['2500'] = 'C4';
    backward['253C'] = 'C5';
    backward['255E'] = 'C6';
    backward['255F'] = 'C7';
    backward['255A'] = 'C8';
    backward['2554'] = 'C9';
    backward['2569'] = 'CA';
    backward['2566'] = 'CB';
    backward['2560'] = 'CC';
    backward['2550'] = 'CD';
    backward['256C'] = 'CE';
    backward['2567'] = 'CF';
    backward['2568'] = 'D0';
    backward['2564'] = 'D1';
    backward['2565'] = 'D2';
    backward['2559'] = 'D3';
    backward['2558'] = 'D4';
    backward['2552'] = 'D5';
    backward['2553'] = 'D6';
    backward['256B'] = 'D7';
    backward['256A'] = 'D8';
    backward['2518'] = 'D9';
    backward['250C'] = 'DA';
    backward['2588'] = 'DB';
    backward['2584'] = 'DC';
    backward['258C'] = 'DD';
    backward['2590'] = 'DE';
    backward['2580'] = 'DF';
    backward['3B1']  = 'E0';
    backward['DF']   = 'E1';
    backward['393']  = 'E2';
    backward['3C0']  = 'E3';
    backward['3A3']  = 'E4';
    backward['3C3']  = 'E5';
    backward['B5']   = 'E6';
    backward['3C4']  = 'E7';
    backward['3A6']  = 'E8';
    backward['398']  = 'E9';
    backward['3A9']  = 'EA';
    backward['3B4']  = 'EB';                                                              
    backward['221E'] = 'EC';
    backward['3C6']  = 'ED';
    backward['3B5']  = 'EE';
    backward['2229'] = 'EF';
    backward['2261'] = 'F0';
    backward['B1']   = 'F1';
    backward['2265'] = 'F2';
    backward['2264'] = 'F3';
    backward['2320'] = 'F4';
    backward['2321'] = 'F5';
    backward['F7']   = 'F6';
    backward['2248'] = 'F7';
    backward['B0']   = 'F8';
    backward['2219'] = 'F9';
    backward['B7']   = 'FA';
    backward['221A'] = 'FB';
    backward['207F'] = 'FC';
    backward['B2']   = 'FD';
    backward['25A0'] = 'FE';
    backward['A0']   = 'FF';     
   
    var hD="0123456789ABCDEF";
    this.d2h = function(d)
    {
        var h = hD.substr(d&15,1);
        while(d>15) {d>>=4;h=hD.substr(d&15,1)+h;}
        return h;
    }

    this.h2d = function(h)
    {
        return parseInt(h,16);
    }
   
    this.WriteAll = function(what)
    {
        //Create Stream object

        var BinaryStream = WScript.CreateObject("ADODB.Stream");
        //Specify stream type - we cheat and get string but 'like' binary

        BinaryStream.Type = adTypeText;
        BinaryStream.CharSet = '437';         
        //Open the stream

        BinaryStream.Open();
        // Write to the stream

        BinaryStream.WriteText(this.Forward437(what));
        // Write the string to the disk

        BinaryStream.SaveToFile(this.path, adSaveCreateOverWrite);

        // Clearn up

        BinaryStream.Close();
    }
   
    this.ReadAll  = function()
    {
        //Create Stream object - needs ADO 2.5 or heigher

        var BinaryStream = WScript.CreateObject("ADODB.Stream")
        //Specify stream type - we cheat and get string but 'like' binary

        BinaryStream.Type = adTypeText;
        BinaryStream.CharSet = codePage;
        //Open the stream

        BinaryStream.Open();
        //Load the file data from disk To stream object

        BinaryStream.LoadFromFile(this.path);
        //Open the stream And get binary 'string' from the object

        var what = BinaryStream.ReadText;
        // Clean up

        BinaryStream.Close();
        return this.Backward437(what);
    }
   
    /* Convert a octet number to a code page 437 char code */
    this.Forward437 = function(inString)
    {
        var encArray = new Array();
        var tmp='';
        var i=0;
        var c=0;
        var l=inString.length;
        var cc;
        var h;
        for(;i<l;++i)
        {
            c++;
            if(c==128)
            {
                encArray.push(tmp);
                tmp='';
                c=0;
            }
            cc=inString.charCodeAt(i);
            if(cc<128)
            {
                tmp+=String.fromCharCode(cc);
            }      
            else
            {
                h=this.d2h(cc);
                h=forward[''+h];
                tmp+=String.fromCharCode(this.h2d(h));
            }
        }
        if(tmp!='')
        {
            encArray.push(tmp);
        }

        // this loop progressive concatonates the

        // array elements entil there is only one

        var ar2=new Array();
        for(;encArray.length>1;)
        {
            var l=encArray.length;
            for(var c=0;c<l;c+=2)
            {
                if(c+1==l)
                {
                    ar2.push(encArray[c]);
                }
                else
                {
                    ar2.push(''+encArray[c]+encArray[c+1]);
                }
            }
            encArray=ar2;
            ar2=new Array();
        }
        return encArray[0];
    }
    /* Convert a code page 437 char code to a octet number*/
    this.Backward437 = function(inString)
    {
        var encArray = new Array();
        var tmp='';
        var i=0;
        var c=0;
        var l=inString.length;
        var cc;
        var h;
        for(;i<l;++i)
        {
            c++;
            if(c==128)
            {
                encArray.push(tmp);
                tmp='';
                c=0;
            }
            cc=inString.charCodeAt(i);
            if(cc<128)
            {
                tmp+=String.fromCharCode(cc);
            }
            else
            {
                h=this.d2h(cc);
                h=backward[''+h];
                tmp+=String.fromCharCode(this.h2d(h));
            }
        }
        if(tmp!='')
        {
            encArray.push(tmp);
        }

        // this loop progressive concatonates the

        // array elements entil there is only one

        var ar2=new Array();
        for(;encArray.length>1;)
        {
            var l=encArray.length;
            for(var c=0;c<l;c+=2)
            {
                if(c+1==l)
                {
                    ar2.push(encArray[c]);
                }
                else
                {
                    ar2.push(''+encArray[c]+encArray[c+1]);
                }
            }
            encArray=ar2;
            ar2=new Array();
        }
        return encArray[0];
    }
   
}

// Example Code

/*
var bf0=new BinaryFile();
var crFolder = 'C:/Temp/cr'
var bf1=new BinaryFile(crFolder+"/PCDV0026.JPG");
var bf2=new BinaryFile(crFolder+"/PCDV0026_.JPG");
bf2.WriteAll(bf1.ReadAll());
*/

/**
*  Base64 encode / decode
*  http://www.webtoolkit.info/
**/

function Base64() {
 
	// private property
	this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
	// public method for encoding
	this.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = this._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	}
 
	// public method for decoding
	this.decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = this._utf8_decode(output);
 
		return output;
 
	}
 
	// private method for UTF-8 encoding
	 this._utf8_encode = function(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	// private method for UTF-8 decoding
	this._utf8_decode = function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var remainders = Array();
  var i, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */
  while(dividend.length > 0)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[remainders.length] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  /* Append leading zero equivalents */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)))
  for(i = output.length; i < full_length; i++)
    output = encoding[0] + output;

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}