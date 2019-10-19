const eventEmitter = require("events");
import _ from "lodash";
export default _;

//class Event extends eventEmitter {}
//export const event = new Event();
//event.on("p", a => console.log("ocurrió p: ", a));

const THEME_COLOR = "#FEA500";
const WITHE_COLOR = "#FFFFFF";
export const cmToPoints = margins => ({
  top: margins.top * 28,
  bottom: margins.bottom * 28,
  left: margins.left * 28,
  right: margins.right * 28
});
export const header = (doc, header, x, y, WIDTH) => {
  doc.image(header, x, y, { width: WIDTH });
};
export const footer = (doc, footer, x, y, WIDTH) => {
  doc.image(footer, x, y - 35, { width: WIDTH - 28 });
};
export const newRect = (doc, dimType) => {
  const _W = 792,
    _H = 612,
    cornerRad = 8;
  //dims = [x, y, w, h];
  const dims = {
    "11": [14, 65, _W - 28, _H - (35 + 70)]
  };
  const dim = dims[dimType];
  return {
    dim: dim,
    trace: color => {
      doc
        .roundedRect(...dim, cornerRad)
        .strokeColor(color)
        .stroke();
    }
  };
};
export const fitImage = (doc, path, x, y, w, h) => {
  if (!path) console.error("Dont Image Path");
  doc.image(path, x, y, { fit: [w, h], align: "center", valign: "center" });
};
export const newCanvas = (
  doc,
  xCanvas,
  yCanvas,
  hCanvas,
  wCanvas,
  cornerRad
) => {
  doc
    .roundedRect(xCanvas, yCanvas, hCanvas, wCanvas, cornerRad)
    .strokeColor(THEME_COLOR)
    .stroke();
};
export const tableInfo = (
  doc,
  xCol1,
  yCol1,
  widthCol1,
  heightCol1,
  cornerRad,
  info,
  WIDTH
) => {
  const gap = 5;
  doc
    .roundedRect(xCol1, yCol1, widthCol1 - 5, heightCol1, cornerRad)
    .fillAndStroke(THEME_COLOR, THEME_COLOR);

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
};

export const coverPage = (
  doc,
  headerImg,
  footerImg,
  xCanvas,
  yCanvas,
  xCol1,
  yCol1,
  widthCol1,
  heightCol1,
  hCanvas,
  cornerRad,
  info
) => {
  const { height: HEIGHT, width: WIDTH } = doc.page;
  header(doc, headerImg, 0, 0, WIDTH);
  footer(doc, footerImg, xCol1, HEIGHT, WIDTH);
  newCanvas(doc, xCanvas, yCanvas, hCanvas, hCanvas, cornerRad);
  tableInfo(
    doc,
    xCol1,
    yCol1,
    widthCol1 - 5,
    heightCol1,
    cornerRad,
    info,
    WIDTH
  );

  doc
    .save()
    .opacity(0.8)
    .circle(114, 306, 100)
    .clip();
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const color = (col % 2) - (row % 2) ? "#eee" : THEME_COLOR;
      doc.rect(row * 20 + 14, col * 20 + 206, 20, 20).fill(color);
    }
  }
  doc.restore();
  doc
    .fontSize(50)
    .fillColor("#614409")
    .font("Helvetica-Bold")
    .text("REPORTE", xCanvas + 20, 206)
    .text("FOTOGRÁFICO", xCanvas + 50, 406);
};
const partitionArr = (arr, gap) => {
  let res = [];
  for (let i = 0, j = gap; i < arr.length; j += gap, i += gap) {
    res.push(arr.slice(i, j));
  }
  return res;
};
const roundDims = arr => arr.map(x => Math.round(x));
const drawGrid = (doc, arrDims) => {
  doc.addPage();
  const cornerRad = 8;
  for (let i = 0; i < arrDims.length; i++) {
    doc
      .roundedRect(...arrDims[i], cornerRad)
      .strokeColor(THEME_COLOR)
      .stroke();
  }
};
const drawImages = (doc, arrImage, typeGrid) => {
  const _W = 792,
    _H = 612,
    Xi = 14,
    Yi = 65;
  const w = _W - 28,
    h = _H - (35 + 70),
    pad = 3;
  //dims = [x, y, w, h];
  const dims = {
    "11": [Xi, Yi, w, h],
    "44": [
      roundDims([Xi, Yi, w / 2 - pad, h / 2 - pad]),
      roundDims([Xi + w / 2 + 2 * pad, Yi, w / 2 - pad, h / 2 - pad]),
      roundDims([Xi, Yi + h / 2 + pad * 2, w / 2 - pad, h / 2 - pad]),
      roundDims([
        Xi + w / 2 + 2 * pad,
        Yi + h / 2 + pad * 2,
        w / 2 - pad,
        h / 2 - pad
      ])
    ],
    "66": [
      roundDims([Xi, Yi, w / 3 - 2 * pad, h / 2 - pad]),
      roundDims([Xi + w / 3 + pad, Yi, w / 3 - 2 * pad, h / 2 - pad]),
      roundDims([Xi + (2 * w) / 3 + 2 * pad, Yi, w / 3 - 2 * pad, h / 2 - pad]),
      roundDims([Xi, Yi + h / 2 + pad, w / 3 - 2 * pad, h / 2 - pad]),
      roundDims([
        Xi + w / 3 + pad,
        Yi + h / 2 + pad,
        w / 3 - 2 * pad,
        h / 2 - pad
      ]),
      roundDims([
        Xi + (2 * w) / 3 + 2 * pad,
        Yi + h / 2 + pad,
        w / 3 - 2 * pad,
        h / 2 - pad
      ])
    ]
  };
  for (let page = 0; page < arrImage.length; page++) {
    // draw the grid while add pages
    console.log("length de arr image", arrImage.length);
    drawGrid(doc, dims[typeGrid]);
    // images setting
    for (let j = 0; j < dims[typeGrid].length; j++) {
      console.log(`### ${arrImage[page][j]}`);
      console.log(`### x,y:  ${dims[typeGrid][j].slice(0, 2)}`);
      console.log(`### w,h:  ${dims[typeGrid][j].slice(2, 4)}`);
      console.log(
        `### Length  de dims[typeGrid].length ${dims[typeGrid].length}`
      );
      if (arrImage[page][j]) {
        doc.image(arrImage[page][j], ...dims[typeGrid][j].slice(0, 2), {
          fit: dims[typeGrid][j].slice(2, 4),
          align: "center",
          valign: "center"
        });
      } else return;
    }
  }
};
export const setImages = (doc, arrImage, configPos) => {
  let partitionsImag = undefined;
  switch (configPos) {
    case "11":
      console.log("caso 11");
      newRect(doc, configPos).trace(THEME_COLOR);
      break;
    case "44":
      partitionsImag = partitionArr(arrImage, 4);
      console.log(partitionsImag);
      drawImages(doc, partitionsImag, configPos);
      break;
    case "66":
      partitionsImag = partitionArr(arrImage, 6);
      console.log(partitionsImag);
      drawImages(doc, partitionsImag, configPos);
      break;

    default:
      break;
  }
};
