const path=require("path");
const fs=require("fs");
const hostPath=path.dirname(path.dirname(__dirname))
const fileConfPath=path.join(hostPath,"sbin/setting.conf");
const {getConfigTp} =require("./config.tp");


class HandleConf{
  readConfig(confPath){
    let content=fs.readFileSync(confPath,"utf8");
    const result={};
    content=content.split("\n");
    for(let line of content){
      line=line.trim();
      if(line.startsWith("#"))continue;
      try{
        const [key,value]=line.split("=");
        result[key]=value;
      }catch(e){}    
    }
    this.conf=result;
  }
  getConfig(){
    return this.conf;
  }
  constructor(){
    this.readConfig(fileConfPath)
  }

  createFollowerConfigFile(configFilename){
    fs.writeFileSync(configFilename,getConfigTp());
  }



}


exports.handleConf=new HandleConf();