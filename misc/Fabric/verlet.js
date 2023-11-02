const numParticlesX = 14; // Number of particles along X-axis
const numParticlesY = 20; // Number of particles along Y-axis
const spacing = 10; // Distance between particles
let springStiffness = 0.35; // Spring stiffness
let damping = 0.5; // Damping factor
let breakingPoint = 75;

const gravity = 0.25; // Gravity strength
const windForce = {x:0.5, y:0.0}; // Wind strength
const WIND_SPEED = {x:0.5,y:0.0,variation:0.1};

const windClampX = (o)=>(Math.max(Math.min(o,WIND_SPEED.x+WIND_SPEED.variation),WIND_SPEED.x-WIND_SPEED.variation));
const windClampY = (o)=>(Math.max(Math.min(o,WIND_SPEED.y+WIND_SPEED.variation),WIND_SPEED.y-WIND_SPEED.variation));
const clamp = (o)=>(Math.max(Math.min(o,500),0));
const shuffle = function(array) {return array.map((a) => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map((a) => a.value);}; 
// Create particles
const particles = [];
const graph = Array.from({length: numParticlesX*numParticlesY}, () => []);

for (let y = 0; y < numParticlesY; y++) {
  for (let x = 0; x < numParticlesX; x++) {
    particles.push({
      x: x * spacing,
      y: y * spacing,
      z: 0,
      prevX: x * spacing,
      prevY: y * spacing,
      prevZ: 0,
      rooted: x==0
    });
  }
}

// Define springs
const springs = [];
for (let y = 0; y < numParticlesY; y++) {
  for (let x = 0; x < numParticlesX; x++) {
    if (x < numParticlesX - 1) {
      springs.push({ particleA: y * numParticlesX + x, particleB: y * numParticlesX + x + 1 });
      graph[y * numParticlesX + x].push(y * numParticlesX + x + 1);
      graph[y * numParticlesX + x + 1].push(y * numParticlesX + x);
    }
    if (y < numParticlesY - 1 && x !== 0) {
      springs.push({ particleA: y * numParticlesX + x, particleB: (y + 1) * numParticlesX + x });
      graph[y * numParticlesX + x].push((y + 1) * numParticlesX + x );
      graph[(y + 1) * numParticlesX + x].push(y * numParticlesX + x);
    }
  }
}
const originalSpringNumber = springs.length;

function runCheck() {for (const particle of particles) {
  if (particle.x === NaN || particle.y == NaN) {console.log(particle);}
}}
// Simulate cloth motion
var updatedThisFrame = 0;
function simulateCloth() {
  updatedThisFrame = 0;
  
  windForce.x = windClampX(windForce.x + (Math.random()-0.5)/16);
  windForce.y = windClampY(windForce.y + (Math.random()-0.5)/16);
  for (const particle2 in (particles)) {
    const particle = particles[particle2]
    if (particle.rooted || graph[particle2].length == 0) continue;
    const vx = particle.x - particle.prevX;
    const vy = particle.y - particle.prevY;
    
    particle.prevX = particle.x;
    particle.prevY = particle.y;
    
    particle.x = clamp(particle.x + vx + windForce.x);
    particle.y = clamp(vy + gravity + particle.y + windForce.y);
    updatedThisFrame++;
  }
  // Satisfy spring constraints
  const springToRemove = [];
  for (const spring2 in springs) {
    const spring = springs[spring2];
    if (spring.particleA===undefined || spring.particleB===undefined) {continue;}
    const particleA = particles[spring.particleA];
    const particleB = particles[spring.particleB];
    
    const dx = particleB.x - particleA.x;
    const dy = particleB.y - particleA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance == 0) {continue;}
    if (distance > breakingPoint) {
      removeItemOnce(graph[spring.particleA],spring.particleB);
      removeItemOnce(graph[spring.particleB],spring.particleA);
      springToRemove.unshift(spring2);
      continue;
    }
    const springForceX = (dx / distance) * (distance - spacing) * springStiffness;
    const springForceY = (dy / distance) * (distance - spacing) * springStiffness;
    if (!particleA.rooted) {
      particleA.x = clamp(particleA.x+springForceX);
      particleA.y = clamp(particleA.y+springForceY);
    } if (!particleB.rooted) {
      particleB.x = clamp(particleB.x-springForceX);
      particleB.y = clamp(particleB.y-springForceY);
    }
  }
  for (const spring of springToRemove) {
    springs.splice(spring,1);
  }
}