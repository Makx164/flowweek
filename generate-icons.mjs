// Generates icon-192.png, icon-512.png, apple-touch-icon.png via Canvas API
// Run once: node generate-icons.mjs
import { createCanvas } from "canvas";
import { writeFileSync } from "fs";

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const r = size * 0.18;

  // background
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, "#7c5cff");
  bg.addColorStop(1, "#36c5ff");
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, size, size, r);
  ctx.fill();

  // "F" letter
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${size * 0.52}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("F", size / 2, size / 2 + size * 0.03);

  return canvas.toBuffer("image/png");
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

writeFileSync("public/icon-192.png", drawIcon(192));
writeFileSync("public/icon-512.png", drawIcon(512));
writeFileSync("public/apple-touch-icon.png", drawIcon(180));
console.log("Icons generated ✓");
