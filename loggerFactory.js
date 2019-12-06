const path=require("path");


const placeStr=(strContent,place)=>{
  const disCount=place-strContent.length;
  if(disCount>0){
    return strContent+new Array(disCount).fill(" ").join('')
  }
  return strContent;
}

const printLevel=(level,place=6)=>{
  if(level=="info"){
    return "[\033[32m"+placeStr(level,place)+"\033[0m] ";
  }
  if(level=="warn"){
    return "[\033[35m"+placeStr(level,place)+"\033[0m] "
  }
  if(level=="error"){
    return "[\033[31m"+placeStr(level,place)+"\033[0m] ";
  }
  if(level=="debug"){
    return "[\033[33m"+placeStr(level,place)+"\033[0m] ";
  }
}

const printLabel=(label)=>{
  return "\033[36m"+label+"\033[0m"
}

class LoggerFactory{


  constructor(filename,config,transports){
    this.activeLevel=config.level;
    this.levelSort=["debug","info","warn","error"];
    this.activeLevelIndex=this.levelSort.indexOf(config.level);

    this.filename=filename;
    this.transports=transports;
    this.info=(message)=>this.record("info",message);
    this.debug=(message)=>this.record("debug",message);
    this.warn=(message)=>this.record("warn",message);
    this.error=(message)=>this.record("error",message);
  }

  record(level,message){
    const print=(...content)=>{
      if(this.levelSort.indexOf(level)<this.activeLevelIndex)return;
      console.log(...content);
    }
    this.transports&&this.transports.forEach(transport=>{
      transport({
        level,
        filename:this.filename,
        message,
        print:print
      })
    })
  }


}

class MainLogger{
 
  
  constructor(){
     /*
  * interface LoggerConifg:
  * level : debug
  *
  */
    this.loggerConfig={
      level:"info"
    }
    this.transports=[];
  }

  
  addTransport(plugin){
    this.transports.push(plugin)
  }

  config(loggerConfig){
    Object.assign(this.loggerConfig,loggerConfig);
  }

  getLogger(_filename){
    const filename=this.getFilename(_filename);
    return new LoggerFactory(filename,this.loggerConfig,this.transports);
  }
  getFilename(filename){
    const pathlist=filename.split(path.sep);
    return pathlist.slice(pathlist.length-2).join("/");
  }
}

module.exports.defaultConsoleTransport=(
  {level,filename,message,print}
)=>{
  const d=new Date();
  const dataStr=`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`

  print(
    printLevel(level)+
    printLabel(placeStr(`${dataStr} ${filename}`,50))+
    " : "+message
  );
}

module.exports.MainLogger=MainLogger;