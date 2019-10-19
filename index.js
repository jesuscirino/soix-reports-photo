const PDF = require("pdfkit");
const sizeOf = require("image-size");
const fs = require("fs");

const {
  destination,
  _margins,
  footer,
  header,
  info,
  pathImage,
  configPos
} = require("./config/config.json");
import * as trace from "./lib/m1.js";
console.log(pathImage);
let arrImage = fs
  .readdirSync(pathImage)
  .filter(f => f.match(/(.png)|(.jpg)|(.jpeg)$/i))
  .map(i => pathImage + "/" + i);

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
});

trace.setImages(doc, arrImage, configPos);
doc.end();
