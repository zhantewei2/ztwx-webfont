const webfont=require('webfont').default;
const path=require("path")
const {run_promise,root_join}=require("../tool");
const fs=require("fs");
const {LoggerFactory}=require("../logger");

const log=LoggerFactory.getLogger(__filename);


const writeFont=async(outputName,fontBytes)=>{
  await run_promise(
    fs.writeFile,
    outputName,
    fontBytes
  );

}
const writeCss=async(outputName,templateBytes)=>{
  await run_promise(
    fs.writeFile,
    outputName,
    templateBytes
  )
}
const current_resources=root_join("static/public");

const buildWebfont=async(imgDir,outDir,formats,fontName,templateClassName,writeCurrent=true)=>{
  try{
    log.debug(`build imgDir: ${imgDir}`);
    log.debug(`build outDir: ${outDir}`);
    log.debug(`build currentDir: ${current_resources}`)
    const result=await webfont({
    files:imgDir+"/**/*.svg",
    fontName,
    formats:formats,
    template:"css",
    templateClassName:templateClassName
    });
    //write css
    await writeCss(path.join(outDir,fontName+".css"),result.template)
    //write font

    for (let format of formats){
      await writeFont(path.join(outDir,fontName+"."+format),result[format]);
    }

    if(writeCurrent){
      await writeCss(path.join(current_resources,fontName+".css"),result.template);
      for(let format of formats){
        await writeFont(path.join(current_resources,fontName+"."+format),result[format]);
      }
    }
    log.info("build webfont successful")
  }catch(e){
    log.error(e);
    throw e;
  }
}

const attemptFont=async(filePath)=>{
  try{
    const result= await webfont({
      files:filePath
    })
    log.debug("attempt font successful")
  }catch(e){
    throw "compiler svg failure"
  }
};

const hostPath=path.dirname(__dirname);
//
// const imgDir=path.resolve(hostPath,"dist/imgs");
// const outDir=path.resolve(hostPath,"dist/output");

// buildWebfont(imgDir,outDir,["woff","woff2"],"hello","fa")

exports.buildWebfont=buildWebfont;
exports.attamptFont=attemptFont;
// const run=async()=>{
//   try{
//    await attemptFont(path.join(imgDir,"1.svg"))
//   }catch(e){
//     console.log(e)
//   }
// }
// run()