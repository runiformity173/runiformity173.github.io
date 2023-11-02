class Joint {
    constructor(x, y, rooted = false) {
      this.x = x;
      this.y = y;
      this.rooted = rooted;
    }
  }
  
  class Bone {
    constructor(startJoint, endJoint) {
      this.startJoint = startJoint;
      this.endJoint = endJoint;
      this.originalLength = this.calculateLength();
      this.length = this.originalLength;
    }
  
    calculateLength() {
      const dx = this.endJoint.x - this.startJoint.x;
      const dy = this.endJoint.y - this.startJoint.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  
  class FABRIK {
    constructor(joints, bones) {
      this.joints = joints;
      this.bones = bones;
    }
  
    solve(targetX, targetY, gravity) {
      // Forward reaching phase
      this.joints[this.joints.length - 1].x = targetX;
      this.joints[this.joints.length - 1].y = targetY;
  
      for (let iteration = 0; iteration < 10; iteration++) {
        // Backward reaching phase
        for (let i = this.joints.length - 2; i >= 0; i--) {
          const currentJoint = this.joints[i];
          const nextJoint = this.joints[i + 1];
          const bone = this.bones[i];
  
          if (!currentJoint.rooted) {
            const dirX = nextJoint.x - currentJoint.x;
            const dirY = nextJoint.y - currentJoint.y;
            const len = Math.sqrt(dirX * dirX + dirY * dirY);
  
            const ratio = bone.originalLength / len;
            currentJoint.x = nextJoint.x - dirX * ratio;
            currentJoint.y = nextJoint.y - dirY * ratio;
          }
        }
  
        // Forward reaching phase
        for (let i = 0; i < this.joints.length - 1; i++) {
          const currentJoint = this.joints[i];
          const nextJoint = this.joints[i + 1];
          const bone = this.bones[i];
  
          if (!nextJoint.rooted) {
            const dirX = currentJoint.x - nextJoint.x;
            const dirY = currentJoint.y - nextJoint.y;
            const len = Math.sqrt(dirX * dirX + dirY * dirY);
  
            const ratio = bone.originalLength / len;
            nextJoint.x = currentJoint.x - dirX * ratio;
            nextJoint.y = currentJoint.y - dirY * ratio;
          }
        }
      }
    }
  }
  