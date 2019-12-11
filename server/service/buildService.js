const configuration=require("../../configuration");
const {LoggerFactory} =require("../../logger");
const fs =require("fs");
const {run_promise,rmDirRecursive}=require("../../tool");
const log=LoggerFactory.getLogger(__filename);
const path=require("path");
const {attamptFont} =require("../../webfont/build-webfont");

const iconExists=async(iconName)=>{

    const findIcon=async(searchDir)=>{
        const list=await run_promise(
            fs.readdir,
            searchDir
        );
        let fileStat;
        let filePath;
        for(let i of list){
           filePath=path.join(searchDir,i);
          fileStat=await run_promise(
              fs.stat,
              filePath
          );
          if(fileStat.isFile()){
              if(i==iconName)return true;
          }else if (fileStat.isDirectory()){
              const dirResult=await findIcon(filePath);
              if(dirResult)return true;
          }
        }
    };
    return await findIcon(configuration.imgDir);
};


class TryBuildFileService{
    
    constructor(){
        this.checkDir=async()=>{
            try{
                await run_promise(
                    fs.stat,
                    configuration.tmpDir
                )
                await rmDirRecursive(configuration.tmpDir);
            }catch(e){
                if(e.errno==-4058){
                    log.debug("try icon- not found tmpDir")
                }
            }finally{
                //can not found;
                //create tmp dir;
                log.debug("try icon-  create icon tmpDir");
                await this.mkTmp();
            }
        }
        this.mkTmp=async()=>{
            await run_promise(
                fs.mkdir,
                configuration.tmpDir
            )
        };
        this.findIconExists=iconExists;
        this.buildTmpIcon=async(request,filename)=>{
            const fileStream=fs.createWriteStream(path.join(configuration.tmpDir,filename));
            await new Promise((resolve,reject)=>{
                const p=request.pipe(fileStream);
                p.on("finish",()=>resolve());
                p.on("error",()=>reject());
            });
        };

        this.attemptBuild=async()=>{
            await attamptFont(configuration.tmpDir);
        }
    }
}


exports.tryBuildFileService=new TryBuildFileService();

// const run=async()=>{
//     try{
//      // await tryBuildFileService.checkDir();
//     const r=await iconExists("account2.svg");
//     console.log(r)
//     }catch(e){
//         console.log(11,e)
//     }
// }
//
// run()