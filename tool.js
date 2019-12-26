const path=require("path")
const fs=require("fs");
const rootPath=__dirname;

const run_promise=(fn,...args)=>
  new Promise((resolve,reject)=>{
    fn.call(fn,...args,(err,result)=>{
        if(err)return reject(err);
        resolve(result);
      })
  });


module.exports.rmDirRecursive=async(dirName)=>{
  const rm=async(filePath)=>{
    const stat=await run_promise(
      fs.stat,
      filePath
    )
    if(stat.isDirectory()){
      const dirList=await run_promise(
        fs.readdir,
        filePath
      )
      for(let i of dirList){
        await rm(path.join(filePath,i));
      }
      await run_promise(
        fs.rmdir,
        filePath
      )
    }else{
      await run_promise(
        fs.unlink,
        filePath
      )
    }
  }
  await rm(dirName)
}

module.exports.root_join=(...args)=>path.join(rootPath,...args);
exports.run_promise=run_promise;