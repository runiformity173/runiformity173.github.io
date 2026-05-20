/*
IceView Library [JavaScript]
Version 2.1

IceView handles the math for a standard pan/zoom/rotate 3D or 2D interface, for both a mouse and touchscreen.
It also provides touch gesture recognition.

(c) Ice Fractal 2022 - www.icefractal.com
This code is open-source under the MIT License.
You must include this copyright notice in anything that includes this code or modified parts of it.

*/


/*
// ---------------------------------------
// ------------ EXAMPLES -----------------
// ---------------------------------------

Note that if your scene is redrawn every frame, you don't need to use the view.onchange. It's mostly
useful for a static object, like a graph, which doesn't need to be refreshed unless the user moves it.

-- 2D VIEW EXAMPLE --

	var view = new IceView(elem); // elem is the HTML element (canvas, svg, etc) that displays the 2D scene you want to view.
	
	function refresh_my_scene() {
		// Replace these example transform functions with the correct ones for your API.
		resetTransform();
		translate(view.pos.x, view.pos.y);
		scale(view.scale);
		
		draw_my_scene();
	}
	view.onchange = refresh_my_scene;


-- 3D VIEW EXAMPLE --

	var view = new IceView3d(elem); // elem is the HTML element (canvas, svg, etc) that displays the 3D object you want to view.
	
	function refresh_my_scene() {
		// Replace these example transform functions with the correct ones for your API.
		resetTransform();
		rotateZ(view.rot.z);
		rotateX(view.rot.x);
		translate(view.pos.x, view.pos.y, view.pos.z);
		
		draw_my_scene();
	}
	view.onchange = refresh_my_scene;

*/

const ICEVIEW_2D = 0; // 2D pan/zoom
const ICEVIEW_3D = 1; // 3D pan/zoom/rotate
const ICEVIEW_SIMPLE = 1; // Simple touch and mouse event handling.

// Wrapper for 3D so your code looks cleaner. Use new IceView3d(elem) instead of new IceView(elem, true)
var IceView3d = function(elem) {return new IceView(elem, ICEVIEW_3D);}

// IceView - 2D is the default. Just call new IceView(elem).
var IceView = function(elem, mode) {
	var that = this;
	
	// ---------------------
	// PUBLIC PROPERTIES
	// ---------------------
	
	if (mode == ICEVIEW_3D) { // 3D Viewer
		
		// CameraView Transform (Do After the ModelView):
		// 
		this.pos = window.Vec3d ? new Vec3d(0, 0, -10) : {x: 0, y: 0, z: -10};
		this.rot = window.Vec3d ? new Vec3d(-60, 0, 40) : {x: -60, y: 0, z: 40}; // Y is only used if trackball mode is enabled.
		this.trackball = false; // Trackball mode, which avoids gimbal lock but can be annoying because the object does not stay upright.
		
		this.disableRightClick = true; // Right-click is used for panning.
		this.unproject = null; // To enable the accurate mouse wheel zoom (where it zooms into the point under the cursor in 3D space), you must provide an unproject function(x,y,z) => {x, y, z}. If this is null, then the simple zoom is used where it just zooms into the center.		
		this.unprojectcamera = null; // Set this instead of unproject if this view's rotation is not included in the calculation.
		this.enableGlobalKeys = true; // Global keyboard viewer controls work regardless of which element is focused (Ctrl+[Arrow Keys] to rotate, Ctrl+Shift+[Arrow Keys] to pan, Ctrl+< to zoom out, and Ctrl+. to zoom in.) This is usually handy, but causes problems if you have more than one IceView open in the same document.
		
		this.speed = { // The speed at which the view changes in relation to mouse movement
			pan: 1.0,
			wheel: 1.0,
			rotate: 1.0
		};
		
	} else { // 2D Viewer
		
		// Coordinate Transform: pixels = (world + pos) * scale
		this.pos = {x: 0, y: 0};
		this.scale = 1.0;
		this.enableGlobalKeys = true; // Global keyboard viewer controls work regardless of which element is focused (Ctrl+[Arrow Keys] to pan, Ctrl+< to zoom out, and Ctrl+. to zoom in.) This is usually handy, but causes problems if you have more than one IceView open in the same document.
		
		this.speed = { // The speed at which the view changes in relation to mouse movement. For panning, 1.0 exactly follows the cursor.
			pan: 1.0,
			wheel: 1.0,
			scale: 1.0
		};
		
	}
	
	// Called when the view is changed.
	this.onchange = function() {};
	this.ondown = function(x,y,touchnum) {};
	this.onwheel = function(x,y) {};
	this.onup = function() {};
	
	// ---------------------
	// READONLY PUBLIC PROPERTIES
	// ---------------------
	
	if (window.Mtx34) { // If Mtx34 (part of WebGX) is available.
		this.mtx = null; // This will have the matrix for this view.
		
		this.refresh = function() { // Refreshes the matrix. This is automatically called every time before onchange, but you need to call this if you manually change the view position or rotation.
			that.mtx = new Mtx34().rotateZ(that.rot.z).rotateY(that.rot.y).rotateX(that.rot.x).translate(that.pos);
		}
		this.refresh();
	} else this.refresh = function() {};
	
	this.isdown = false; // true while a finger or mouse is being held down.
	
	// ---------------------
	// INTERNAL CODE
	// ---------------------
	
	var PI_180 = Math.PI/180.0;
	var PI_360 = Math.PI/360.0;
	
	var mouse = [0,0], lmouse = [0,0], dmouse;
	var touch = [0,0], ltouch = [0,0], dtouch, touchnum = 0; // The second finger of a touch event.
	var hwidth, hheight;

	function distance(p1, p2) {
		var dx = p1[0]-p2[0];
		var dy = p1[1]-p2[1];
		return Math.sqrt(dx*dx + dy*dy);
	}

	function getmouse(e) {
		e.preventDefault();
		
		lmouse = [mouse[0], mouse[1]];
		ltouch = [touch[0], touch[1]];
		var ntnum;
		if (e.touches !== undefined) {
			mouse[0] = e.touches[0].pageX;
			mouse[1] = e.touches[0].pageY;
			ntnum = e.touches.length > 1 ? 2 : 1;
			if (ntnum == 2) {
				touch[0] = e.touches[1].pageX;
				touch[1] = e.touches[1].pageY;
			}
		} else {
			ntnum = 1;
			mouse[0] = e.pageX;
			mouse[1] = e.pageY;
		}
		var rect = elem.getBoundingClientRect();
		mouse[0] -= rect.left + window.scrollX;
		mouse[1] -= rect.top + window.scrollY;
		
		touch[0] -= rect.left + window.scrollX;
		touch[1] -= rect.top + window.scrollY;
		
		hwidth = rect.width / 2;
		hheight = rect.height / 2;
		
		if (ntnum != touchnum) {
			touchnum = ntnum;
			getmouse(e);
		}
		touchnum = ntnum;
		dmouse = [mouse[0] - lmouse[0], mouse[1] - lmouse[1]];
		dtouch = distance(touch, mouse) - distance(ltouch, lmouse);
	}

	function mousedown(e) {
		getmouse(e);
		that.isdown = true;
		that.ondown(mouse[0], mouse[1], touchnum);
		elem.focus();
	}
	
	function qmul(a, b) { // Multiply two quaternions.
		return {
		w: a.w*b.w - a.x*b.x - a.y*b.y - a.z*b.z,
		x: a.w*b.x + a.x*b.w + a.y*b.z - a.z*b.y,
		y: a.w*b.y - a.x*b.z + a.y*b.w + a.z*b.x,
		z: a.w*b.z + a.x*b.y - a.y*b.x + a.z*b.w
	}}
	
	function rotate3d(dx, dy) {
		var x = dx * that.speed.rotate * 0.5;
		var y = dy * that.speed.rotate * 0.5;
		
		if (that.trackball) {
		
			// Convert the current rotations (ZYX) to quaternions.
			var qz = {w: Math.cos(-that.rot.z * PI_360), x: 0, y: 0, z: Math.sin(-that.rot.z * PI_360)};
			var qy = {w: Math.cos(that.rot.y * PI_360), x: 0, y: Math.sin(that.rot.y * PI_360), z: 0};
			var qx = {w: Math.cos(that.rot.x * PI_360), x: Math.sin(that.rot.x * PI_360), y: 0, z: 0};
			var qdy = {w: Math.cos(x * PI_360), x: 0, y: Math.sin(x * PI_360), z: 0}; // Y-axis delta for this event.
			
			var q = qmul(qz, qmul(qy, qmul(qx, qdy))); // ZYX Rotation Order, then Delta Y
			
			// Decompose to ZYX Angles
			// Source: www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToEuler/
			// X
			var sinx_cosy = 2 * (q.w * q.x + q.y * q.z);
			var cosx_cosy = 1 - 2 * (q.x * q.x + q.y * q.y);
			that.rot.x = Math.atan2(sinx_cosy, cosx_cosy) / PI_180;
			
			// Y
			var siny = 2 * (q.w * q.y - q.z * q.x);
			that.rot.y = Math.abs(siny) < 1 ? Math.asin(siny) / PI_180 : (siny > 0 ? 90 : -90);
			
			// Z
			var sinz_cosy = 2 * (q.w * q.z + q.x * q.y);
			var cosz_cosy = 1 - 2 * (q.y * q.y + q.z * q.z);
			that.rot.z = -Math.atan2(sinz_cosy, cosz_cosy) / PI_180;
			
			that.rot.x += y; // X-axis delta for this event.
			
		} else {
			that.rot.x = (that.rot.x + y) % 360.0;
			if (that.rot.x < 0) that.rot.x += 360;
			that.rot.z = that.rot.z + x * (that.rot.x > 10 && that.rot.x < 170 ? -1 : 1);
		}
	}
	
	function mousemove(e) {
		getmouse(e);
		if (that.isdown) {
			if (e.buttons == 2 && !that.disableRightClick) return;
			
			if (mode == ICEVIEW_3D) { // 3D Viewer
				
				if (e.shiftKey || touchnum == 2) { // Touchscreen Pinch Zoom/Pan
					that.pos.x += dmouse[0] * that.speed.pan / 100;
					that.pos.y -= dmouse[1] * that.speed.pan / 100;
					if (touchnum == 2) {
						that.pos.z += dtouch * that.speed.pan / 20;
						/*if (that.trackball) {
							var langle = Math.atan2(ltouch[0] - lmouse[0], ltouch[1] - lmouse[1]);
							var angle = Math.atan2(touch[0] - mouse[0], touch[1] - mouse[1]);
							that.
						}*/
					}
				} else if (e.altKey) { // Zoom
					that.pos.z += -dmouse[1] * that.speed.pan / 20;
				} else { // Rotate
					rotate3d(dmouse[0], dmouse[1]);
				}
				
			} else { // 2D Viewer
				if (touchnum == 2) { // Touchscreen Pinch Zoom/Pan
					var zfac = Math.exp(dtouch * that.speed.scale / 200.0);
					
					that.scale *= zfac;
					
					that.pos.x -= ((mouse[0] - hwidth) * (1 - zfac) + dmouse[0] * that.speed.pan)/that.scale;
					that.pos.y += ((mouse[1] - hheight) * (1 - zfac) + dmouse[1] * that.speed.pan)/that.scale;
				} else {
					if (e.altKey || e.buttons == 2) { // Zoom
						var zfac = Math.exp(-dmouse[1] * that.speed.scale / 100.0);
						that.scale *= zfac;
					} else { // Pan
						that.pos.x -= dmouse[0] * that.speed.pan / that.scale;
						that.pos.y += dmouse[1] * that.speed.pan / that.scale;
					}
				}
			}
			that.refresh();
			that.onchange();
		}
	}

	function mousewheel(e) {
		that.onwheel(mouse[0], mouse[1]);
		
		var delta = e.deltaY * that.speed.wheel;
		if (e.deltaMode == 0) delta *= 0.03;
		
		if (mode == ICEVIEW_3D) { // 3D Viewer
			
			if (!that.unproject && !that.unprojectcamera) {
				that.pos.z -= delta/2; // Fallback. Just zoom.
			} else { // Zoom into the point in 3D space under the cursor.
				var p1 = (that.unproject || that.unprojectcamera)(mouse[0], mouse[1], -1.0);
				var p2 = (that.unproject || that.unprojectcamera)(mouse[0], mouse[1], -2.0);
				
				var v = {w:0, x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z};
				
				if (!that.unprojectcamera) {
					var qz = {w: Math.cos(that.rot.z * PI_360), x: 0, y: 0, z: Math.sin(that.rot.z * PI_360)};
					var qy = {w: Math.cos(that.rot.y * PI_360), x: 0, y: Math.sin(that.rot.y * PI_360), z: 0};
					var qx = {w: Math.cos(that.rot.x * PI_360), x: Math.sin(that.rot.x * PI_360), y: 0, z: 0};
					var q = qmul(qx, qmul(qy, qz));

					v = qmul(qmul(q, v), {w:q.w, x:-q.x, y:-q.y, z:-q.z});
				}
				
				var scale = delta*0.5 / Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
				
				that.pos.x += v.x*scale;
				that.pos.y += v.y*scale;
				that.pos.z += v.z*scale;
			}
			
		} else { // 2D Viewer
			
			var zfac = Math.exp(-delta/20.0);
			
			that.scale *= zfac;
			
			that.pos.x -= ((mouse[0] - hwidth) * (1 - zfac)) / that.scale;
			that.pos.y += ((mouse[1] - hheight) * (1 - zfac)) / that.scale;
		}
		that.refresh();
		that.onchange();
		
		e.preventDefault();
		return false;
	}

	function mouseup(e) {
		that.isdown = false;
		e.preventDefault();
		that.onup();
	}
	
	elem.addEventListener("mousedown", mousedown);
	elem.addEventListener("mousemove", mousemove);
	elem.addEventListener("mouseup", mouseup);
	elem.addEventListener("wheel", mousewheel);
	elem.addEventListener("contextmenu", function(e) {if (that.disableRightClick) e.preventDefault();});
	
	elem.addEventListener("touchstart", mousedown);
	elem.addEventListener("touchmove", mousemove);
	elem.addEventListener("touchend", mouseup);
	
	function onkeydown(e) {
		if (mode == ICEVIEW_3D) {
			var pan = 20 * that.speed.pan / 100;
			var rotate = 10;
			switch (e.keyCode) {
				case 37: // LEFT
					if (e.shiftKey) that.pos.x += pan; else rotate3d(rotate, 0);
					break;
				case 38: // UP
					if (e.shiftKey) that.pos.y -= pan; else rotate3d(0, rotate);
					break;
				case 39: // RIGHT
					if (e.shiftKey) that.pos.x -= pan; else rotate3d(-rotate, 0);
					break;
				case 40: // DOWN
					if (e.shiftKey) that.pos.y += pan; else rotate3d(0, -rotate);
					break;
				case 188: // <
					that.pos.z -= pan*4;
					break;
				case 190: // >
					that.pos.z += pan*4;
					break;
				default: return;
			}
		} else {
			var pan = 20/that.scale;
			switch (e.keyCode) {
				case 37: // LEFT
					that.pos.x -= pan
					break;
				case 38: // UP
					that.pos.y += pan;
					break;
				case 39: // RIGHT
					that.pos.x += pan;
					break;
				case 40: // DOWN
					that.pos.y -= pan;
					break;
				case 188: // <
					that.scale /= 1.1;
					break;
				case 190: // >
					that.scale *= 1.1;
					break;
				default: return;
			}
		}
		that.refresh();
		that.onchange();
		e.preventDefault();
	}
	
	elem.addEventListener("keydown", function(e) {
		onkeydown(e);
	});
	
	window.addEventListener("keydown", function(e) {
		if (e.ctrlKey && that.enableGlobalKeys) {
			onkeydown(e);
		}
	});
};

