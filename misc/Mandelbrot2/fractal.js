// Standard Library for Ice Fractal
// (c) Ice Fractal 2022 - www.icefractal.com
//
// This code is open source under the MIT license.
// You must include this copyright notice in anything that 
// uses this code or modified parts of it.

var inframe = false; // Tells whether or not this page is inside an iframe.
try {inframe = window.self !== window.top;} catch (e) {inframe = true;}

// Standard C strcmp(), in JavaScript.
function strcmp(a, b) {
	for (var c = 0; 1; c++) {
		var d = (c < a.length ? a.charCodeAt(c) : 0) - (c < b.length ? b.charCodeAt(c) : 0);
		if (d || c == a.length) return d;
	}
}

String.prototype.splice = function(istart, idel, inew) {return this.substr(0, istart) + inew + this.substr(istart + idel);}

function CopyText(x) {
	var i = null;
	if (typeof(x) == "string") {
		var i = document.createElement("textarea");
		i.style = "position: fixed; top:0; left:0;"; // Prevent auto-scroll on focus.
		document.body.appendChild(i);
		i.value = x;
		x = i;
	} else if (x.nodeType == 1 && x.tagName && ['textarea','input'].indexOf(x.tagName.toLowerCase()) == -1) {
		CopyText(x.innerText);
		
		var s = window.getSelection();
		s.removeAllRanges();
		var r = document.createRange();
		r.selectNode(mycode);
		s.addRange(r);
		return;
	}
	x.focus();
	x.select();
	document.execCommand('copy');
	if (i) document.body.removeChild(x);
}

function downloadURL(url, name) {
	var a = document.createElement('a');
	a.setAttribute('href', url);
	a.setAttribute('download', name);
	a.innerHTML = "Link";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

// Shortcut for querySelector.
// Specify only a to get document.querySelector(a)
// Specify a and b to get a.querySelector(b)
function qsel(a, b) {if (b) return a.querySelector(b); else document.querySelector(a);}

// Checks if any parts of any element is visible on the screen, accounting for the current scroll.
function isOffScreen(elem) {
	var rbody = document.body.getBoundingClientRect();
	var relem = elem.getBoundingClientRect();
	return relem.bottom < 0 || relem.top > window.innerHeight;
}

function RefreshSmartScrollers() {
	var smarts = document.getElementsByClassName("smartscroll");
	for (var c = 0; c < smarts.length; c++) {
		var offscreen = isOffScreen(smarts[c]);
		if (!offscreen && smarts[c].getAttribute("data-src")) {
			smarts[c].setAttribute("src", smarts[c].getAttribute("data-src"));
			smarts[c].removeAttribute("data-src");
		}
		if (offscreen) smarts[c].classList.add("offscreen"); else smarts[c].classList.remove("offscreen");
	}
}

function DisplayTimestamps() {
	var ts = document.getElementsByClassName("timestamp");
	for (var c = 0; c < ts.length; c++) {
		if (ts[c].innerHTML == "") {
			var date = new Date((+ts[c].title)*1000);
			ts[c].innerHTML = new Intl.DateTimeFormat("en-US", {dateStyle:"medium"}).format(date);
		}
	}
}

window.addEventListener("load", function() {
	if (document.getElementsByClassName("smartscroll").length > 0) {
		window.addEventListener("scroll", RefreshSmartScrollers);
		RefreshSmartScrollers();
	}
	DisplayTimestamps();
});

function SlowScrollBG() {
	var y = 0;
	setInterval(function() {
		var bg = document.querySelector(".pagebg");
		if (bg) bg.style["background-position"] = "0 " + (y++) + 'px';
	}, 100);
}

function bin(byteval) {return String.fromCharCode(byteval);}

// Bools must be a multiple of 8.
function packbits(bools) {
	var bytestr = '';
	var b = 0;
	for (var c = 0; c < bools.length; c++) {
		b = (b << 1) | (bools[c] ? 1 : 0);
		if ((c & 7) == 7) {bytestr += bin(b); b = 0;}
	}
	if (bools.length & 7) bytestr += bin(b << (8 - (bools.length & 7)));
	return bytestr;
}

function unpackbits(bytestr) {
	var bools = [];
	for (var c = 0; c < bytestr.length; c++) {
		var b = bytestr.charCodeAt(c);
		for (var x = 0; x < 8; x++) {
			bools.push((b & 128) ? true : false);
			b <<= 1;
		}
	}
	return bools;
}
function urlbtoa(s) {
	return btoa(s).replace(/\+/g, "-").replace(/\//g, ".").replace(/=/g, "");
}

function urlatob(s) {
	while (s.length & 3) s += '=';
	return atob(s.replace(/-/g, "+").replace(/\./g, "/"));
}

function hex00(n) {
	n = (+n).toString(16).toUpperCase();
	if (n.length == 1) return "0"+n;
	return n;
}

function btoh(b) {
	var h = '';
	for (var c = 0; c < b.length; c++) h += hex00(b.charCodeAt(c));
	return h;
}

function htob(h) {
	var b = '';
	for (var c = 0; c < h.length; c+=2) b += bin(parseInt(h.substr(c, 2), 16));
	return b;
}

// Math
const M_E =			2.7182818284590452353602874713527; // Euler's number
const M_LOG2E =		1.4426950408889634073599246810019; // log base 2 of e
const M_LOG10E =	0.4342944819032518276511289189165; // log base 10 of e
const M_LN2 =		0.6931471805599453094172321214582; // Natural log of 2
const M_LN10 =		2.3025850929940456840179914546847; // Natural log of 10
const M_PI =		3.1415926535897932384626433832795; // pi
const M_PI_2 =		1.5707963267948966192313216916398; // pi/2
const M_PI_4 =		0.7853981633974483096156608458199; // pi/4
const M_2PI =		6.2831853071795864769252867665590; // 2*pi
const M_PHI =		1.6180339887498948482045868343656; // Golden Ratio (sqrt(5) + 1)/2
const M_GAMMA =		0.5772156649015328606065120900824; // Euler�Mascheroni constant
const M_SQRT2 =		1.4142135623730950488016887242097; // Square root of 2.
const M_SQRT1_2 =	0.7071067811865475244008443621048; // Square root of 0.5
const M_ROOT2PI =	2.5066282746310005024157652848111; // Square root of 2*pi
const PI_180 =		0.0174532925199432957692369076849; // pi/180 (Multiply by this constant to convert from degrees to radians.)
const _180_PI =		57.295779513082320876798154814105; // 180/pi (Multiply by this constant to convert from radians to degrees.)
const DEG_TO_RAD =	PI_180;
const RAD_TO_DEG =	_180_PI;

var min = Math.min;
var max = Math.max;

var abs = Math.abs;
var floor = Math.floor;
var ceil = Math.ceil;
var trunc = Math.trunc;

function round(n, prec) {if (!prec) return Math.round(n); return Math.round(n*prec)/prec;}

var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;
var asin = Math.asin;
var acos = Math.acos;
var atan = Math.atan;
var atan2 = Math.atan2;

var sinh = Math.sinh;
var cosh = Math.cosh;
var tanh = Math.tanh;
var asinh = Math.asinh;
var acosh = Math.acosh;
var atanh = Math.atanh;

var log = Math.log;
var log10 = Math.log10;
var log1p = Math.log1p;
var log2 = Math.log2;
var pow = Math.pow;
var exp = Math.exp;
var expm1 = Math.expm1;
var sqrt = Math.sqrt;
var cbrt = Math.cbrt;
var clz32 = Math.clz32;

var pi = 3.1415926535897932384626433832795;
var e  = 2.71828182845904523536028747135266;

function erf(x) { // Rough approximation that's good enough for a graph.
	return 2.0/(1.0 + Math.exp(-x*2.25675 - x*x*x*0.203)) - 1.0; // Sigmoid-transformed Taylor series.
}

function clamp(x, min, max) { // Unit clamp function.
	if (min === undefined) min = 0;
	if (max === undefined) max = 1;
	return x < min ? min : x > max ? max : x;
}

function ln(x) {
	return Math.log(x);
}

function tri(x) {
	x = Math.abs(x) % 2.0;
	return x >= 1.0 ? 2.0 - x : x;
}

function num(x) {
	if (isNaN(x)) return 0;
	return x;
}

function sec(x) {return 1.0/Math.cos(x);}
function csc(x) {return 1.0/Math.sin(x);}
function cot(x) {return 1.0/Math.tan(x);}
function sech(x) {return 1.0/Math.cosh(x);}
function csch(x) {return 1.0/Math.sinh(x);}

function gamma(x) { // Lanczos Approximation
	const g = 5;
	const p = [ // Coefficients
		1.0000000001900148240,
		76.180091729471463483,
		-86.505320329416767653,
		24.014098240830910488,
		-1.2317395724501553873,
		0.001208650973866178506,
		-5.3952393849531283786e-6
	];
	
	if (x < 0.5) { // Use Euler's relfection formula for Re(z) < 0.5
		return Math.PI / (Math.sin(x * Math.PI) * gamma(1.0 - x));
	} else {
		x--;
		var s = p[0];
		for (var n = 1; n < p.length; n++) {
			s += p[n] / (x + n);
		}
		var t = x + g + 0.5;
		return Math.pow(t, x+0.5) * Math.exp(-t) * s * M_ROOT2PI;
	}
}

// Make sure longer names come before shorter ones that share the same prefix (e.g. "sinh" before "sin"), since sanitizeMath is greedy.
var validnames = [
	'pi', 'erf', 'exp', 'e', 'num', 'clamp',
	'log2', 'log10', 'log1p', 'log', 'ln', 
	'tri', 'abs', 
	'sinh', 'cosh', 'tanh', 'sech', 'csch',
	'asinh', 'acosh', 'atanh',
	'acos', 'asin', 'atan2', 'atan', 
	'sec', 'csc', 'cot', 
	'cos', 'sin', 'tan', 
	'cbrt', 'ceil', 'floor', 'trunc', 'max', 'min', 
	'round', 'sign', 'sqrt', 'pow', 'gamma'
];

function isdigit(x) {
	return x == '0' || x == '1' || x == '2' || x == '3' || x == '4' || x == '5' || x == '6' || x == '7' || x == '8' || x == '9';
}

function isletter(x) {
	return x >= 'a' && x <= 'z' || x >= 'A' && x <= 'Z';
}

// Prohibit everything except for numbers, operators, and a specific list of valid names.
// Returns an object, either {equation: ""} or {error: ""}
function sanitizeMath(s, validnames) {
	if (s.indexOf("=>") != -1) {return {error: "Invalid Text \"=>\""};}
	var waslastok = true;
	var lx;
	var ns = "";
	var c = 0;
outer:
	while (c < s.length) {
		if ((waslastok && isdigit(s[c])) ||
			s[c] == '.' || s[c] == '(' || s[c] == ')' || s[c] == ' ' ||
			s[c] == '-' || s[c] == '+' || s[c] == '*' || s[c] == '/' || s[c] == '^' || s[c] == '|' || s[c] == '!' || s[c] == '&' || s[c] == '%' || s[c] == '?' || s[c] == '=' || s[c] == '<' || s[c] == '>' || s[c] == ':' || s[c] == ',')
		{
			if (s[c] != '.' || (c < s.length-1 && isdigit(s[c+1]))) ns += s[c];
			waslastok = true;
			c++;
		} else {
			lx = c;
			if (waslastok) {
				for (var v = 0; v < validnames.length; v++) {
					if (s.substr(c, validnames[v].length) == validnames[v]) {
						waslastok = false;
						c += validnames[v].length;
						ns += validnames[v];
						continue outer;
					}
				}
			}
			return {error: "Invalid Name At: \""+s.substr(lx)+"\""};
		}
	}
	return {equation: ns.toLowerCase(), toString: function() {return this.equation;}};
}

// A '.' cannot exist unless it's followed by a number.
var mathenc = {
	"_" : " ",
	"~" : "/",
	"'" : "^",
	//"" : ":", // Encoded in the %00 notation.
	//"" : "?",
	//"" : "<",
	//"" : ">",
	//"" : "|",
	"A" : "((",
	"B" : "))",
	"C" : "(((",
	"D" : ")))",
	"E" : "*",
	"-" : "-",
	"F" : "+",
	"G" : ".0",
	"H" : ".1",
	"I" : ".2",
	"J" : ".3",
	"K" : ".4",
	"L" : ".5",
	"M" : ".6",
	"N" : ".7",
	"O" : ".8",
	"P" : ".9",
	"Q" : "tri(",
	"R" : "round(",
	"S" : "sign(",
	"T" : "clamp(",
	"U" : "sqrt(",
	"V" : "sin(",
	"W" : "cos(",
	"X" : "log(",
	"Y" : "abs(",
	"Z" : "erf(",
	"{" : "floor(",
	"[" : "trunc(",
	"}" : "atan2(",
	"#" : "(dx+dy)", // Common pattern.
};

// A * is not encoded, since it is implicit if a number is next to something (like 2(3 + 4) or 2x). Except for a number next to another number, which is ambiguous without the * (like 4*7).
// s must be lower case.
// Cases with implicit *
// #*A
// #*(
// )*#
// )*A
// )*(
// Idea: Aggressive implicit * by moving numbers before letters.
function _removeStars(s) {
	var ns = "";
	var lc = "";
	for (var c = 0; c < s.length; c++) {
		var nc = c+1 <= s.length ? s[c+1] : "";
		
		if (s[c] == '.' && !isdigit(lc)) ns += '0';
		
		if (!(s[c] == '*' && ((isdigit(lc) && isletter(nc)) || (isdigit(lc) && nc == '(') || (lc == ')' && isdigit(nc)) || (lc == ')' && isletter(nc)) || (lc == ')' && nc == '(')))) {
			ns += (s[c] == '*' && (isletter(lc) && isdigit(nc))) ? '.' : s[c];
		}
		
		lc = s[c];
	}
	return ns;
}

// Adds implicit * signs.
function _addStars(s) {
	var ns = "";
	var lc = "";
	var isname = false;
	for (var c = 0; c < s.length; c++) {
		if ((isdigit(lc) && isletter(s[c])) || (isdigit(lc) && s[c] == '(' && !isname) || (lc == ')' && (isdigit(s[c]) || s[c] == '.')) || (lc == ')' && isletter(s[c])) || (lc == ')' && s[c] == '('))
			ns += '*';
		
		if (isletter(s[c])) isname = true;
		else if (!isdigit(s[c])) isname = false;
		
		if (s[c] == '.' && !isdigit(lc)) ns += '0';
		
		ns += s[c];
		lc = s[c];
	}
	return ns;
}

function decodeMath(es) {
	es = decodeURIComponent(es);
	var ds = "";
	
	for (var c = 0; c < es.length; c++) {
		if (mathenc.hasOwnProperty(es[c])) {
			var v = mathenc[es[c]];
			if (v == '+' || v == '-')
				ds += ' ' + v + ' ';
			else if (v[0] == '.' && isletter(ds[ds.length-1]))
				ds += '*' + v[1];
			else
				ds += v;
		} else
			ds += es[c];
	}
	
	var p = 0;
	for (var c = 0; c < ds.length; c++) {
		if (ds[c] == '(') p++;
		else if (ds[c] == ')') p--;
	}
	if (p < 0)
		while (p++ < 0) ds = '(' + ds;
	else
		while (p-- > 0) ds += ')';
	
	return _addStars(ds);
}

function encodeMath(ds) {
	ds = _removeStars(ds.toLowerCase().replace(/ /g, ""));
	if (ds == null) return null;
	
	var es = "";
	
	var c = 0;
	outer:
	while (c < ds.length) {
		if (ds[c] == ' ') {c++; continue;}
		
		for (var key in mathenc) {
			if (!mathenc.hasOwnProperty(key)) continue;
			if (mathenc[key] === ds.substr(c, mathenc[key].length)) {
				es += key;
				c += mathenc[key].length;
				continue outer;
			}
		}
		if (ds[c] != '.' && (ds[c] != '0' || (ds[c-1] != '-' && ds[c-1] != '+' && ds[c-1] != '/' && ds[c-1] != '^' && ds[c-1] != ')'))) es += ds[c]; // A '.' cannot exist unless it's followed by a number, in which case it will be encoded.
		c++;
	}
	
	c = es.length;
	while (c > 0 && es[c-1] == ')') c--;
	es = es.substr(0, c);
	
	return encodeURIComponent(es);
}

function getHash() {
	var hash = window.location.hash;
	if (hash && hash[0] === '#') hash = hash.substr(1);
	return hash;
}

function splitQuery(qs, decodecomps) {
	if (typeof(qs) != "string") {decodecomps = qs; qs = window.location.search;}
	
	var c = 0;
	if (qs[0] == "?") c = 1;
	
	var parts = {};
	
	while (c < qs.length) {
		var x = c;
		while (x < qs.length && qs[x] != '=') x++;
		var y = x+1;
		while (y < qs.length && qs[y] != '&') y++;
		
		var v = x < qs.length ? qs.substring(x+1, y) : "";
		if (decodecomps) v = decodeURIComponent(v);
		parts[qs.substring(c, x)] = v;
		c = y+1;
	}
	
	
	return parts;
}

function ForEach(obj, parser) {
	for (x in obj)
		if (obj.hasOwnProperty(x))
			parser(x, obj[x]);
}

// NOTE: The question mark is not included at the beginning.
function makeQuery(obj, encodecomps) {
	var q = '';
	for (x in obj)
		if (obj.hasOwnProperty(x))
				q += (q=='' ? x : '&' + x) + '=' + (encodecomps ? encodeURIComponent(obj[x]) : obj[x]);
	return q;
}

function autosize(ipt, extra) {
	var e = document.createElement('span');
	var style = window.getComputedStyle(ipt);
	
	e.style.fontSize = style.fontSize;
	e.style.fontFamily = style.fontFamily;
	e.style['white-space'] = 'pre';
	
	if (style['box-sizing'] == 'border-box') {
		e.style.paddingLeft = style.paddingLeft;
		e.style.paddingRight = style.paddingRight;
		e.style.border = "2px solid black";
		e.style['border-right-width'] = style['border-right-width'];
		e.style['border-left-width'] = style['border-left-width'];
	}
	
	e.innerText = ipt.value;
	
	document.body.appendChild(e);
	ipt.style.width = e.offsetWidth + (extra ? extra : 0) + 'px'; // extra padding just to make sure.
	document.body.removeChild(e);
}	let _location = Function("return location")();

// ---------------------
// Cryptography
// ---------------------

// Converts a Uint8Array to a byte string.
function u8tob(u8array) {
	var b = "";
	for (var c = 0; c < u8array.length; c++) b += bin(u8array[c]);
	return b;
}

// Converts a byte string to a Uint8Array
function btou8(b) {
	var b = unescape(encodeURIComponent(b));
	var a = new Uint8Array(b.length);
	for (var c = 0; c < b.length; c++) a[c] = b.charCodeAt(c);
	return a;
}

// Returns a byte string of secure data.
function secureRandom(bytes) {
	var a = new Uint8Array(bytes);
	a = crypto.getRandomValues(a);
	return u8tob(a);
}

function securehash(text, algorithm, callback) {
	crypto.subtle.digest(algorithm, typeof(text) == "string" ? btou8(text) : text).then(function(b) {
		var hash = u8tob(new Uint8Array(b));
		callback(hash);
	});
}

function sha1(text, callback) {securehash(text, "SHA-1", callback);}
function sha256(text, callback) {securehash(text, "SHA-256", callback);}
function sha384(text, callback) {securehash(text, "SHA-384", callback);}
function sha512(text, callback) {securehash(text, "SHA-512", callback);}

