const viewport = document.getElementById('viewport');
const windows = document.getElementById('windows');

const windowList = [];

const minWidths = {
    "initiativeTracker":8,
    "healthTracker":8,
    "notes":6,
};
const minHeights = {
    "initiativeTracker":6,
    "healthTracker":5,
    "notes":4,
};
const defaultNames = {
    "initiativeTracker":"Initiative Tracker",
    "healthTracker": "Health Tracker",
    "notes":"Notes",
}

const SNAP = 32;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.1;

let ID = 0;

let cameraX = 0;
let cameraY = 0;
let zoom = 1;

let panning = false;
let lastX = 0;
let lastY = 0;

function snap(value) {
    return Math.round(value / SNAP) * SNAP;
}

function renderCamera() {
    windows.style.transform = `translate(${cameraX}px, ${cameraY}px) scale(${zoom})`;

    const rect = viewport.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const bgSize = SNAP * zoom;

    const bgX = centerX + cameraX;
    const bgY = centerY + cameraY;

    viewport.style.backgroundSize = `${bgSize}px ${bgSize}px`;
    viewport.style.backgroundPosition = `${bgX}px ${bgY}px`;
}

function createWindow(title, x, y, w, h) {
    const el = document.createElement('div');
    el.className = 'window';
    let ID = 1;
    while (document.getElementById("box-"+ID)) ID++;
    el.innerHTML = `
    <div class="titlebar"><span class="windowName">${title}</span><span class="closeButton">×</span></div>
    <div class="box" id="box-${ID}">
    </div>
    <div class="resize"></div>
    `;

    windows.appendChild(el);

    let posX = x;
    let posY = y;
    let width = w*32;
    let height = h*32;

    const titlebar = el.querySelector('.titlebar');
    const closeButton = el.querySelector('.closeButton');
    const resize = el.querySelector('.resize');

    let dragging = false;
    let resizing = false;
    let startX = 0;
    let startY = 0;

    function renderWindow() {
        const rect = viewport.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        el.style.left = `${snap(posX)+centerX}px`;
        el.style.top = `${snap(posY)+centerY}px`;
        el.style.width = `${Math.max(SNAP*minWidths[el.querySelector(".identifier")?.id]||192, snap(width))}px`;
        el.style.height = `${Math.max(SNAP*minHeights[el.querySelector(".identifier")?.id]||96, snap(height))}px`;
        const textArea = el.querySelector(".notesArea");
        if (textArea) {
            textArea.style.height = Math.max(snap(height)-32,96) + "px";
        }
    }

    renderWindow();
    closeButton.addEventListener("click",function () {
        closeWindow(el.querySelector(".box"));
        e.stopPropagation();
    });
    titlebar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains("closeButton")) {return;}
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        titlebar.style.cursor = 'grabbing';
        e.stopPropagation();
    });

    resize.addEventListener('mousedown', (e) => {
        resizing = true;
        startX = e.clientX;
        startY = e.clientY;
        e.stopPropagation();
    });
    el.renderFunction = renderWindow;
    el.getData = function() {
        return [el.querySelector(".titlebar .windowName").innerHTML, posX,posY,width/32,height/32];
    };
    window.addEventListener('mousemove', (e) => {
        const dx = (e.clientX - startX) / zoom;
        const dy = (e.clientY - startY) / zoom;


        if (dragging) {
            posX += dx;
            posY += dy;
            startX = e.clientX;
            startY = e.clientY;
            renderWindow();
        }

        if (resizing) {
            width += dx;
            height += dy;
            startX = e.clientX;
            startY = e.clientY;
            renderWindow();
        }
    });

    window.addEventListener('mouseup', () => {
        dragging = false;
        resizing = false;
        width = Math.max(SNAP*minWidths[el.querySelector(".identifier")?.id]||192,snap(width));
        height = Math.max(SNAP*minHeights[el.querySelector(".identifier")?.id]||96,snap(height));
        save(el.querySelector(".box"));
        titlebar.style.cursor = 'grab';
    });
    windowList.push(el);
    return el.querySelector(".box");
}
function closeWindow(box) {
    windowList.splice(windowList.findIndex((i)=>(i.querySelector(".box").id === box.id)),1);
    const newWindows = getCookie("windows");
    const boxIndex = newWindows.findIndex(i=>i.name == box.id);
    if (boxIndex > -1) newWindows.splice(boxIndex,1);
    setCookie("windows",newWindows);
    box.closest(".window").remove();
}

viewport.addEventListener('mousedown', (e) => {
    if (e.target !== viewport) return;
    panning = true;
    lastX = e.clientX;
    lastY = e.clientY;
    viewport.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
    if (!panning) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    cameraX += dx;
    cameraY += dy;

    lastX = e.clientX;
    lastY = e.clientY;

    renderCamera();
});

window.addEventListener('mouseup', () => {
    panning = false;
    viewport.style.cursor = 'grab';
});

viewport.addEventListener('wheel', (e) => {
    e.preventDefault();

    const rect = viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const oldZoom = zoom;
    const direction = e.deltaY > 0 ? -1 : 1;

    zoom += direction * ZOOM_STEP;
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

    if (zoom === oldZoom) return;

    const worldX = (mouseX - centerX - cameraX) / oldZoom;
    const worldY = (mouseY - centerY - cameraY) / oldZoom;

    cameraX = mouseX - centerX - worldX * zoom;
    cameraY = mouseY - centerY - worldY * zoom;

    renderCamera();
}, { passive: false });
window.addEventListener("resize", function() {
    renderCamera();
    for (const i of windowList) {
        i.renderFunction();
    }
})

renderCamera();
function addWindow(type) {
    const box = createWindow(defaultNames[type],0,0,minWidths[type],minHeights[type]);
    addModule(type,box);
}