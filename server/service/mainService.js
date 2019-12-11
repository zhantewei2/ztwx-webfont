const configuration =require("../../configuration");
const {run_promise}=require("../../tool");
const fs=require("fs");
const path=require("path");
const {buildWebfont}=require("../../webfont/build-webfont");

const _getIconList=async(list,dir_path,rel_path)=>{
  const host_dir=await run_promise(
    fs.readdir,
    dir_path
  );
  for(let file_name of host_dir){
    const stat=fs.statSync(path.join(dir_path,file_name));
    if(stat.isDirectory()){
      const childrenList=[];
      list.push({
        type:"dir",
        children:childrenList,
        // relpath:rel_path,
        name:file_name
      })
      await _getIconList(childrenList,path.join(dir_path,file_name),rel_path+"/"+file_name)
    }else{
      list.push({
        // type:"file",
        // relpath:rel_path,
        name:file_name
      })
    }
  }
  return list
}


/*
* READ
*/ 
const getIconList=async()=>{
  return await _getIconList([],configuration.imgDir,"")
}

const buildIconList=async()=>{
  await buildWebfont(
    configuration.imgDir,
    configuration.outputDir,
    configuration.formats,
    configuration.fontName,
    configuration.className,
    configuration.currentFontName
  )
}

/**
 * upload icon
 * 
 * 
*/



/**
 * icon has exists 
 * 
*/
const iconExists=async(iconName)=>{

}


/*
* try build icon
*
*/



exports.buildIconList=buildIconList;
exports.getIconList=getIconList;