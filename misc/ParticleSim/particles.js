"use strict";
const particles = [];
let particleId = 0;
const unusedIds = [];
class DynamicParticle {
    constructor(particle, x, y) {
        if (unusedIds.length) {
            this.id = unusedIds.pop();
            particles[this.id] = this;
        }
        else {
            this.id = particleId++;
            particles.push(this);
        }
        this.particle = particle;
        this.vx = 0;
        this.vy = 0;
        this.x = x;
        this.y = y;
    }
    remove() {
        particles[this.id] = null;
        unusedIds.push(this.id);
    }
    applyVelocity(angle,force) {
        this.vx += Math.cos(angle)*force;
        this.vy -= Math.sin(angle)*force;
    }
    rasterize() {
        particles[this.id] = null;
        unusedIds.push(this.id);
        const c = board.board[Math.floor(this.y)][Math.floor(this.x)].id;
        this.particle.id = c;
        board.board[Math.floor(this.y)][Math.floor(this.x)] = this.particle;
        if (this.particle.state == 3) this.particle.isFalling = 0;
    }
    update() {
        const steps = Math.ceil(Math.max(Math.abs(this.vx),Math.abs(this.vy))*3);
        for (let i = 0;i<steps;i++) {
            this.x += this.vx/steps;
            this.y += this.vy/steps;
            if (this.x >= WIDTH-0.5 || this.y >= HEIGHT-0.5 || this.x < 0.5 || this.y < 0.5) {
                this.x = Math.min(Math.max(this.x,0),WIDTH-0.5);
                this.y = Math.min(Math.max(this.y,0),HEIGHT-0.5);
                this.rasterize();
                break;
            }
            const roundedX = Math.floor(this.x);
            const roundedY = Math.floor(this.y);
            if (board.board[roundedY][roundedX].state > 1) {
                this.x -= this.vx/steps;
                this.y -= this.vy/steps;
                this.rasterize();
                break;
            }
            this.vy += 0.15/steps;
        }
        if (this.particle.nextHeat > 0) {
            this.particle.nextHeat = Math.floor(this.particle.heat/2);
            this.particle.heat = this.particle.nextHeat;
        }
    }
}

function addDynamicParticle(x,y,particle) {
    return new DynamicParticle(particle, x+0.5, y+0.5);
}