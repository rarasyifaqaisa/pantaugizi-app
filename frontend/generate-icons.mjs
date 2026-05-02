import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";

// Buat icon SVG sederhana
const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#22c55e"/>
  <text x="256" y="320" font-size="280" text-anchor="middle" fill="white">🥗</text>
</svg>`;

writeFileSync("public/icon.svg", svg);

await sharp(Buffer.from(svg)).resize(192).png().toFile("public/icon-192.png");
await sharp(Buffer.from(svg)).resize(512).png().toFile("public/icon-512.png");

console.log("✅ Icons generated!");