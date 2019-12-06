const ts=require('typescript');
const {run_promise}=require('../tool');
const path=require('path');
const {COMPILER} =require('../config.js');
const fs=require('fs');
const package_path=process.cwd();

const tsconfig_path=path.join(package_path,'tsconfig.json');

const compiler_one=async(middlewares=[],sourceFile)=>{
  try {
    let content = await run_promise(fs.readFile, sourceFile, 'utf8');
    for(let i of middlewares){
      content=await i({content,sourceFile:sourceFile})
    }
    return content;

  }catch(e){
    console.error(e)
  }
};

const containHTML=async ({content,sourceFile})=>{
  const reg=/templateUrl.*?(?=(\,|}))/g;
  const matcher=reg.exec(content);
  if(matcher){
    const sourceDir=path.dirname(sourceFile);
    const matcherContent=matcher[0];
    const matcherIndex=matcher.index;
    const htmlFileReg=/('|")(.*?)('|")/;
    const htmlFileName=htmlFileReg.exec(matcherContent)[2];
    const htmlFilePath=path.join(sourceDir,htmlFileName);
    const htmlFileContent=await run_promise(fs.readFile,htmlFilePath,'utf8');
    return content.slice(0,matcherIndex)+`template:\`${htmlFileContent}\``+content.slice(matcherIndex+matcherContent.length);
  }
  return content;
};

const tsCompiler=async({content})=>{
  let tsconfig = await run_promise(fs.readFile, tsconfig_path, 'utf8');
  tsconfig = JSON.parse(tsconfig);
  const tsCompilerOptions=tsconfig.compilerOptions;
  const extendsAttrs=[
    'target','typeRoots','allowJs','lib','paths','importHelpers','experimentalDecorators',
    'emitDecoratorMetadata','sourceMap','declaration','module'
  ];
  const compilerConfig={};
  for(let i of extendsAttrs){
    if(tsCompilerOptions[i]!==undefined)compilerConfig[i]=tsCompilerOptions[i];
  }
  return ts.transpile(content, {
    compilerOptions:tsCompiler
  });
};

const handle=async(inputDir,outputDir,filterFn)=>{
    try{
      const stat=await run_promise(fs.lstat,inputDir);
      if(stat.isDirectory()){
        const listFile=await run_promise(fs.readdir,inputDir);
        if(!fs.existsSync(outputDir))fs.mkdirSync(outputDir);
        for(let fileName of listFile){
          const filePath=path.join(inputDir,fileName);
          await handle(filePath,path.join(outputDir,fileName),filterFn);
        }
      }else{
        if(filterFn&&filterFn(inputDir)){
          await run_promise(fs.copyFile,inputDir,outputDir);
        }else{
          const content=await compiler_one([containHTML],inputDir);
          // outputDir=outputDir.replace(/\.\w+$/,'.js');
          await run_promise(fs.writeFile,outputDir,content,'utf8');
        }
      }
    }catch(e){

    }
};

const filterFn=fileName=>{
  const reg=/\.(\w+)?$/;
  const matcher=reg.exec(fileName);
  if(!matcher)return true;
  return ! (['ts'].indexOf(matcher[1].toLowerCase())>=0);
};


handle(
  path.join(package_path,COMPILER.rootDir),
  path.join(package_path,COMPILER.outDir),
  filterFn
);