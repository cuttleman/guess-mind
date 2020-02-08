import { getSocket } from "./sockets";

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const save = document.getElementById("jsSave");
const CANVAS_SIZE = 500;
const INITIAL_COLOR = "#2c2c2c";

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

/*pixel modifier*/
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

const beginPath = (x, y) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const strokePath = (x, y, color = null) => {
  let currentColor = ctx.strokeStyle;
  if (color !== null) {
    ctx.strokeStyle = color;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.strokeStyle = currentColor;
};

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    beginPath(x, y);
    getSocket().emit(window.events.beginPath, { x, y });
  } else {
    strokePath(x, y);
    getSocket().emit(window.events.strokePath, {
      x,
      y,
      color: ctx.strokeStyle
    });
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

function fill(color = null) {
  let currentColor = ctx.fillStyle;
  if (color !== null) {
    ctx.fillStyle = color;
  }
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = currentColor;
}

function handleFillCanvas() {
  if (filling) {
    fill();
    getSocket().emit(window.events.fill, { color: ctx.fillStyle });
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

export const handleBeganPath = ({ x, y }) => {
  beginPath(x, y);
};

export const handleStrokedPath = ({ x, y, color }) => {
  strokePath(x, y, color);
};

export const handleFilled = ({ color }) => {
  fill(color);
};

export const disableCanvas = () => {
  canvas.removeEventListener("mousemove", onMouseMove);
  canvas.removeEventListener("mousedown", startPainting);
  canvas.removeEventListener("mouseup", stopPainting);
  canvas.removeEventListener("mouseleave", stopPainting);
  canvas.removeEventListener("click", handleFillCanvas);
};

export const enableCanvas = () => {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleFillCanvas);
};

if (canvas) {
  canvas.addEventListener("contextmenu", handleCM);
}
