const THEME_COLOR = "#FEA500";
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
export const newRect = (doc, x, y, w, h) => {
  const _W = 792,
    _H = 612,
    cornerRad = 8,
    dims = [x, y, w, h];
  return {
    dims: dims,
    trace: color => {
      doc
        .roundedRect(x, y, w, h, cornerRad)
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
export const setPartition = (doc, config, arrImage, imageInf, imageSup) => {
  const W = 764,
    H = 498,
    xi = 14,
    yi = 65;
  console.log(`ALERT imageinferior  ${imageInf} imageSuperior ${imageSup}`);
  switch (config) {
    case "1":
      let r = newRect(doc, xi, yi, W, H);
      r.trace("#fffff");
      fitImage(doc, arrImage[0], ...r.dims);
      break;
    case "2":
      let r1 = newRect(doc, xi, yi, W / 2 - 5, H);
      r1.trace("#fffff");
      fitImage(doc, arrImage[imageInf], ...r.dims);
    // r = newRect(doc, xi + W / 2 - 10, yi, W / 2 - 5, H);
    //r.trace("#fffff");
    //fitImage(doc, arrImage[++imageInf], ...r.dims);

    default:
      break;
  }
};
export const setImages = (doc, arrImage, configPos) => {
  const arrConfigPage = configPos.split("-");
  let imageInf = 0,
    imageSup = 0;
  for (let index = 0; index < arrConfigPage.length; index++) {
    doc.addPage();
    imageInf += imageSup;
    imageSup += Number(arrConfigPage[index]);
    console.log(`ALERT ${arrImage}`);
    setPartition(doc, arrConfigPage[index], arrImage, imageInf, imageSup);
  }
};
