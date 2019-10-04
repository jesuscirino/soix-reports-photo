const PDF = require("pdfkit");
const sizeOf = require("image-size");
const fs = require("fs");
const {
  destination,
  _margins,
  footer,
  header,
  info
} = require("./config/config.json");
import * as trace from "./lib/m1.js";

// set margins
const marginsPoints = trace.cmToPoints(_margins);

const doc = new PDF({ layout: "landscape", margins: marginsPoints });
const { height: HEIGHT, width: WIDTH } = doc.page;
doc.pipe(fs.createWriteStream(destination));

console.log(`Width=${WIDTH} - Height=${HEIGHT}`);

const [xCol1, yCol1, widthCol1, heightCol1, cornerRad] = [
  14,
  65,
  WIDTH / 7,
  48,
  8
];
const yCanvas = yCol1 + heightCol1 + 10;
const hCanvas = HEIGHT - (35 + yCanvas + 10);
const xCanvas = WIDTH - (hCanvas + 14);

/*trace.header(doc, header, 0, 0, WIDTH);
trace.footer(doc, footer, xCol1, HEIGHT, WIDTH);
trace.newCanvas(doc, xCanvas, yCanvas, hCanvas, cornerRad);
trace.tableInfo(
  doc,
  xCol1,
  yCol1,
  widthCol1 - 5,
  heightCol1,
  cornerRad,
  info,
  WIDTH
);
*/
trace.coverPage(
  doc,
  header,
  footer,
  xCanvas,
  yCanvas,
  xCol1,
  yCol1,
  widthCol1,
  heightCol1,
  hCanvas,
  cornerRad,
  info
);

doc.on("pageAdded", () => {
  trace.header(doc, header, 0, 0, WIDTH);
  trace.footer(doc, footer, xCol1, HEIGHT, WIDTH);
  trace.newCanvas(doc, 14, yCol1, WIDTH - 28, HEIGHT - (yCol1 + 45), cornerRad);
});
doc.addPage();
const r = trace.newRect(doc, 50, 50, 100, 100);
r.trace("#fffff");
doc.addPage();
doc.end();
