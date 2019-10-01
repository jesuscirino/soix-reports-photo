const PDF = require("pdfkit");
const fs = require("fs");
const { destination, _margins } = require("./config.json");
import { cmToPoints } from "./lib/m1.js";

const marginsPoints = cmToPoints(_margins);

const doc = new PDF({ layout: "landscape", margins: marginsPoints });
doc.pipe(fs.createWriteStream(destination));
console.log(doc.page.width);
console.log(doc.page.height);
doc.moveTo(0, 0);
doc.rect(0, 0, doc.page.width, 72);
doc.stroke();
doc.text("SOIX");
doc.end();
