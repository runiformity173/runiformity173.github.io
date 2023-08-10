'use strict';
let temperatureNoise={reset:function(){this.memory = {};this.gradients = {};},rand_vect:function(){var t=2*Math.random()*Math.PI;return{x:Math.cos(t),y:Math.sin(t)}},dot_prod_grid:function(t,r,i,n){let e;r={x:t-i,y:r-n};return this.gradients[[i,n]]?e=this.gradients[[i,n]]:(e=this.rand_vect(),this.gradients[[i,n]]=e),r.x*e.x+r.y*e.y},smootherstep:function(t){return 6*t**5-15*t**4+10*t**3},interp:function(t,r,i){return r+this.smootherstep(t)*(i-r)},seed:function(){this.gradients={},this.memory={}},get:function(t,r){if(this.memory.hasOwnProperty([t,r]))return this.memory[[t,r]];var i=Math.floor(t),n=Math.floor(r),e=this.dot_prod_grid(t,r,i,n),o=this.dot_prod_grid(t,r,i+1,n),s=this.dot_prod_grid(t,r,i,n+1),h=this.dot_prod_grid(t,r,i+1,n+1),o=this.interp(t-i,e,o),h=this.interp(t-i,s,h),h=this.interp(r-n,o,h);return this.memory[[t,r]]=h}};
let humidityNoise={reset:function(){this.memory = {};this.gradients = {};},rand_vect:function(){var t=2*Math.random()*Math.PI;return{x:Math.cos(t),y:Math.sin(t)}},dot_prod_grid:function(t,r,i,n){let e;r={x:t-i,y:r-n};return this.gradients[[i,n]]?e=this.gradients[[i,n]]:(e=this.rand_vect(),this.gradients[[i,n]]=e),r.x*e.x+r.y*e.y},smootherstep:function(t){return 6*t**5-15*t**4+10*t**3},interp:function(t,r,i){return r+this.smootherstep(t)*(i-r)},seed:function(){this.gradients={},this.memory={}},get:function(t,r){if(this.memory.hasOwnProperty([t,r]))return this.memory[[t,r]];var i=Math.floor(t),n=Math.floor(r),e=this.dot_prod_grid(t,r,i,n),o=this.dot_prod_grid(t,r,i+1,n),s=this.dot_prod_grid(t,r,i,n+1),h=this.dot_prod_grid(t,r,i+1,n+1),o=this.interp(t-i,e,o),h=this.interp(t-i,s,h),h=this.interp(r-n,o,h);return this.memory[[t,r]]=h}};
let NOISE_CONSTANT = 256;
// let perlin = {
//     rand_vect: function(){let theta = Math.random() * 2 * Math.PI;return {x: Math.cos(theta), y: Math.sin(theta)};},
//     dot_prod_grid: function(x, y, vx, vy){
//         let g_vect;
//         let d_vect = {x: x - vx, y: y - vy};
//         if (this.gradients[[vx,vy]]){
//             g_vect = this.gradients[[vx,vy]];
//         } else {
//             g_vect = this.rand_vect();
//             this.gradients[[vx, vy]] = g_vect;
//         }
//         return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
//     },
//     smootherstep: function(x){
//         return 6*x**5 - 15*x**4 + 10*x**3;
//     },
//     interp: function(x, a, b){
//         return a + this.smootherstep(x) * (b-a);
//     },
//     seed: function(){
//         this.gradients = {};
//         this.memory = {};
//     },
//     get: function(x, y) {
//         if (this.memory.hasOwnProperty([x,y]))
//             return this.memory[[x,y]];
//         let xf = Math.floor(x);
//         let yf = Math.floor(y);
//         //interpolate
//         let tl = this.dot_prod_grid(x, y, xf,   yf);
//         let tr = this.dot_prod_grid(x, y, xf+1, yf);
//         let bl = this.dot_prod_grid(x, y, xf,   yf+1);
//         let br = this.dot_prod_grid(x, y, xf+1, yf+1);
//         let xt = this.interp(x-xf, tl, tr);
//         let xb = this.interp(x-xf, bl, br);
//         let v = this.interp(y-yf, xt, xb);
//         this.memory[[x,y]] = v;
//         return v;
//     }
// }
temperatureNoise.seed();
humidityNoise.seed();
function getTemperatureNoise(x,y) {
  return clamp(temperatureNoise.get(x/NOISE_CONSTANT,y/NOISE_CONSTANT)+0.5+temperatureNoise.get(x/(NOISE_CONSTANT/10),y/(NOISE_CONSTANT/10))/10,0,1);
}
function getHumidityNoise(x,y) {
  return clamp(humidityNoise.get(x/NOISE_CONSTANT,y/NOISE_CONSTANT)+0.5+humidityNoise.get(x/(NOISE_CONSTANT/10),y/(NOISE_CONSTANT/10))/10,0,1);
  
}