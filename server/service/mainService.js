const configuration =require("../../configuration");
const {run_promise}=require("../../tool");
const fs=require("fs");
const path=require("path");
const {buildWebfont}=require("../../webfont/build-webfont");
const {FileNotFoundException} =require("../exceptions/CustomExceptions");
const {LoggerFactory} =require("../../logger");

const log=LoggerFactory.getLogger(__filename);
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
 * 
 * @des get base configuration
 * @return 
 *    fontPrefix 样式前缀名
 */
const getBaseConfiguration=async=()=>{
  return {
    fontPrefix:configuration.className,
  }
}



/**
 * delete icon
 * 
 * 
*/
const deleteIcon=async(iconName,iconDir)=>{
  const fullPath=path.join(path.join(configuration.imgDir,iconDir),iconName+".svg");
  try {
      log.debug("delete img:"+fullPath);
      await run_promise(
          fs.unlink,
          fullPath
      );
  }catch(e){
      throw new FileNotFoundException();
  }
}
/**修改图标名
 * 
 * @param {*} iconName 
 * @param {新名} newName 
 * @param {*} iconDir 
 */
const modifyIcon=async(iconName,newName,iconDir)=>{
  try{
    const fullOldPath=path.join(configuration.imgDir,iconDir,iconName+".svg");
    const fullNewPath=path.join(configuration.imgDir,iconDir,newName+".svg");
    await run_promise(
      fs.rename,
      fullOldPath,
      fullNewPath
    )
  }catch(e){
    throw new FileNotFoundException(e);
  }
}

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


exports.deleteIcon=deleteIcon;
exports.buildIconList=buildIconList;
exports.getIconList=getIconList;
exports.getBaseConfiguration=getBaseConfiguration;
exports.modifyIcon=modifyIcon;