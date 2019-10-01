const PDF = require("pdfkit");
const fs = require("fs");
const { destination, _margins } = require("./config.json");
import { cmToPoints } from "./lib/m1.js";
// set margins
const marginsPoints = cmToPoints(_margins);

const doc = new PDF({ layout: "landscape", margins: marginsPoints });
doc.pipe(fs.createWriteStream(destination));
console.log(`Width=${doc.page.width} - Height=${doc.page.height}`);
//doc.moveTo(10, 10);
doc
  .roundedRect(5, 5, doc.page.width - 10, 72, 8)
  .fillOpacity(0.5)
  .fillAndStroke("#FEA500", "#FEA500")
  .text("SOIX", 50, 50);
doc.moveTo(10, 10);
doc.text("SOIX", 50, 50);
doc.end();
