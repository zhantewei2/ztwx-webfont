const path=require('path');

const root_path=path.dirname(__dirname);
const join=(...args)=>path.join(root_path,...args);
const parent_path=path.dirname(path.dirname(root_path));
const joinP=(...args)=>path.join(parent_path,...args);

const ICON={
  files:join('static/icon'),
  fontName:"nzxFont_v1",
  formats:['woff2','woff'],
  templateClassName:"fa",
  template:'css',
  templateFontPath:'../font',
  templateFontName:'nzxFont_v1',
  templateCSSPath:'../css',
  css_files:join('static/css'),
  font_files:join('static/font')
};


const COMPILER={
  rootDir:'lib/src',
  outDir:'temp',
};

const BUILDER={
  outputDir:joinP('dist/mm'),
  staticDirName:'static',
  sassInput:'style/main.scss',
  cssOutputName:'nzx.css',
  cssAllOutputName:'nzx-all.css'
};




module.exports={
  parent_path,
  root_path,
  ICON,
  join,
  joinP,
  BUILDER,
  COMPILER,
};