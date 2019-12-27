
exports.getConfigTp=({
  outputDir="cm-webfont/dist",
  imgDir="cm-webfont/resources",
  fontName="cmNzx",
  fontClassName="fa",
  formats=["woff","woff2"]
}={})=>{

  return `
{
  "outputDir":"${outputDir}",
  "imgDir":"${imgDir}",
  "fontName":"${fontName}",
  "fontClassName":"${fontClassName}",
  "formats":${JSON.stringify(formats)}
}
`.trim();
};