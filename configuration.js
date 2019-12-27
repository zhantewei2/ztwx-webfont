const {root_join}=require("./tool");
const path=require("path");
const fs=require("fs");
const assert=require("assert").strict;
const {LoggerFactory}=require("./logger")
const log=LoggerFactory.getLogger(__filename);
const {handleConf} =require("./server/lib/handle-conf");
const workspaceDir=process.cwd();

const sbinConf=handleConf.getConfig();

class Configuration{
  get tmpDir(){
    return path.join(this.outputDir,this.tmpProfileDirName);
  }
  get outputDir(){
    return this._outputDir;
  }
  get imgDir(){
    return this._imgDir;
  }
  get fontName(){
    return this._fontName;
  }
  //webfont server使用的font 文件名。不可更改
  get currentFontName(){
    return "nzx";
  }

  set outputDir(v){
    this._outputDir=this.checkDir(v);
  }

  set imgDir(v){
    this._imgDir=this.checkDir(v);
  }

  checkDir(dirpath){
    dirpath=dirpath.replace(/\//g,path.sep);
    dirpath=path.join(workspaceDir,dirpath);
    if(!fs.existsSync(dirpath)) fs.mkdirSync(dirpath,{recursive:true});
    return dirpath;
  }

  constructor(){
    this.formats=["woff","woff2"];
    // 该值可传递给wefont frontend ，动态设置
    this.className="na";
    this.tmpProfileDirName=".tmp-test-icon";
    this._outputDir="";
    this._imgDir="";
    this._fontName="";
    this.sbinConf=sbinConf;
  }

  loadConfiguration(filename){
    try{
      const fileExists=fs.existsSync(filename);
      assert(fileExists,"Configuration file not found");
      const CONF=JSON.parse(fs.readFileSync(filename,"utf8"));
      this.outputDir=CONF["outputDir"];
      this.imgDir=CONF["imgDir"];
      this._fontName=CONF["fontName"];
      this.className=CONF["fontClassName"];
      this.formats=CONF["formats"];
      
    }catch(e){
      log.error(e.toString());
      process.exit();
    }
  }

}

const configuration=new Configuration();
module.exports=configuration;