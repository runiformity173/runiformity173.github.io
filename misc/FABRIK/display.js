const canvas = document.getElementById("output");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");

// const joints = [new Joint(0,0,true), new Joint(50, 0,true), new Joint(50, 50), new Joint(0, 50)];
// const bones = [new Bone(joints[0],joints[1]), new Bone(joints[0],joints[3]), new Bone(joints[2],joints[1]), new Bone(joints[3],joints[2])];
// const joints = [new Joint(0,250,true),new Joint(35,250),new Joint(70,250),new Joint(105,250),new Joint(140,250)];
// const bones = [new Bone(joints[0],joints[1]),new Bone(joints[1],joints[2]),new Bone(joints[2],joints[3]),new Bone(joints[3],joints[4])];
const joints = [new Joint(250,0,true),new Joint(250,40),new Joint(250,80),new Joint(250,120),new Joint(250,160),new Joint(250,200),new Joint(250,240),new Joint(250,280),new Joint(250,320),new Joint(250,360)];
const bones = [new Bone(joints[0],joints[1]),new Bone(joints[1],joints[2]),new Bone(joints[2],joints[3]),new Bone(joints[3],joints[4]),new Bone(joints[4],joints[5]),new Bone(joints[5],joints[6]),new Bone(joints[6],joints[7]),new Bone(joints[7],joints[8]),new Bone(joints[8],joints[9])];

const fabrik = new FABRIK(joints, bones);

// const gravity = { x: 0, y: 0};
const gravity = { x: 0, y: 9.81 };
let targetX = 250;
let targetY = 100;

ctx.strokeStyle = "black";
ctx.lineWidth = 2;

function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.height / rect.height));
  return [y, x];
}

window.addEventListener("mousemove",function(event){
  const [y,x] = getMousePos(event);
  targetX = x;
  targetY = y;
})
function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fabrik.solve(targetX, targetY, gravity);
  for (bone of bones) {
    ctx.beginPath();
    ctx.moveTo(bone.startJoint.x, bone.startJoint.y);
    ctx.lineTo(bone.endJoint.x, bone.endJoint.y);
    ctx.stroke();
  } for (joint of joints) {
    ctx.beginPath();
    ctx.arc(joint.x, joint.y, 6, 0, 2*Math.PI);
    if (!joint.rooted) ctx.fillStyle = "grey";
    else ctx.fillStyle = "orange";
    
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);