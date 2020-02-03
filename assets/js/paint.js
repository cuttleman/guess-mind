const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const save = document.getElementById("jsSave");
const CANVAS_SIZE = 500;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
/*pixel modifier*/
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = "#2c2c2c";
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function handleRangeChange(event) {
  const strokeSize = event.target.value;
  ctx.lineWidth = strokeSize;
}

function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleFillCanvas() {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "paint";
  }
}

function handleCM(event) {
  event.preventDefault();
}

function handleSaveBtn() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "junint[🎨]";
  link.click();
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleFillCanvas);
  canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach(color =>
  color.addEventListener("click", handleColorClick)
);

if (range) {
  range.addEventListener("input", handleRangeChange);
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}

if (save) {
  save.addEventListener("click", handleSaveBtn);
}
