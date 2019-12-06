const fs=require('fs');
const path=require('path');
const {run_promise}=require('./tool');
const {ICON} =require('./config');
const {copyFile} =require('./tool/fs');
const basePath=process.cwd();
const targetDir=process.argv[2];
const abs_targetDir=path.join(basePath,targetDir);

const run=async()=>{
  try{
    if (!targetDir)throw 'please specify targetDir';
    const cssDir=path.join(abs_targetDir,'css');
    const fontDir=path.join(abs_targetDir,'font');
    await run_promise(copyFile,ICON.css_files,cssDir);
    await run_promise(copyFile,ICON.font_files,fontDir);
    console.log("file copy completed")
  }catch(e){
    console.error(e);
  }
};

run();