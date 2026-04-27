const viewport = document.getElementById("viewport");
const windows = document.getElementById("windows");

let dragging2 = false;
let lastX = 0;
let lastY = 0;

let cameraX = 0;
let cameraY = 0;
let zoom = 1;

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_SPEED = 0.05;

function render() {
    viewport.style.transformOrigin = "center center";
    viewport.style.transform = `scale(${zoom})`;
    windows.style.transform = `translate(${cameraX}px, ${cameraY}px)`;

    viewport.style.backgroundPosition =
        `${cameraX - 16}px ${cameraY - 16}px`;

    viewport.style.backgroundSize =
        `${gridSize}px ${gridSize}px`;
}

viewport.addEventListener("mousedown", (e) => {
    dragging2 = true;
    lastX = e.clientX;
    lastY = e.clientY;
    viewport.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
    dragging2 = false;
    viewport.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
    if (!dragging2) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    lastX = e.clientX;
    lastY = e.clientY;

    cameraX += dx/zoom;
    cameraY += dy/zoom;

    render();
});

viewport.addEventListener("wheel", (e) => {
    e.preventDefault();

    const rect = viewport.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const relativeX = (mouseX - centerX) / zoom;
    const relativeY = (mouseY - centerY) / zoom;

    const oldZoom = zoom;

    const direction = e.deltaY > 0 ? -1 : 1;
    zoom *= (Math.pow(1.07,direction));

    if (zoom < MIN_ZOOM) zoom = MIN_ZOOM;
    if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;

    const scale = zoom / oldZoom;

    cameraX -= relativeX * (scale - 1);
    cameraY -= relativeY * (scale - 1);

    render();
}, { passive: false });

render();