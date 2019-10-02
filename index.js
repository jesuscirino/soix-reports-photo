const PDF = require("pdfkit");
const fs = require("fs");
const {
  destination,
  _margins,
  footer,
  header,
  info
} = require("./config/config.json");
import { cmToPoints } from "./lib/m1.js";

// set margins
const marginsPoints = cmToPoints(_margins);

const doc = new PDF({ layout: "landscape", margins: marginsPoints });
const { height: HEIGHT, width: WIDTH } = doc.page;
doc.pipe(fs.createWriteStream(destination));
console.log(`Width=${WIDTH} - Height=${WIDTH}`);
const [xCol1, yCol1, widthCol1, heightCol1, cornerRad, gap] = [
  14,
  65,
  WIDTH / 7,
  48,
  8,
  5
];

doc.image(header, 0, 0, { width: WIDTH });
doc.image(footer, xCol1, HEIGHT - 35, { width: WIDTH - 28 });

doc
  .roundedRect(xCol1, yCol1, widthCol1 - 5, heightCol1, cornerRad)
  .fillAndStroke("#FEA500", "#FEA500");

doc
  .fillOpacity(1)
  .fillColor("#FFFFFF")
  .font("Helvetica-Bold")
  .fontSize(10)
  .text(info.cel11, xCol1 + gap, yCol1 + gap)
  .moveDown(0.2)
  .text(info.cel21)
  .moveDown(0.2)
  .text(info.cel31);

doc
  .roundedRect(
    xCol1 + WIDTH / 7,
    yCol1,
    WIDTH - (WIDTH / 7 + 28),
    heightCol1,
    cornerRad
  )
  .fillAndStroke();
doc
  .fillColor("#3D3E3E")
  .font("Helvetica-Bold")
  .fontSize(10)
  .text(info.cel12, xCol1 + gap + WIDTH / 7, yCol1 + gap)
  .moveDown(0.2)
  .font("Helvetica")
  .text(info.cel22)
  .moveDown(0.2)
  .text(info.cel32);

doc.end();
