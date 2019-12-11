const {root_join}=require("./tool");
const path=require("path");
class Configuration{
  get tmpDir(){
    return path.join(this.outputDir,this.tmpProfileDirName);
  }
  get outputDir(){
    return root_join("dist/output")
  }
  get imgDir(){
    return root_join("dist/imgs")
  }
  get fontName(){
    return "nzx";
  }
  constructor(){
    this.formats=["woff","woff2"];
    this.className="na";
    this.tmpProfileDirName=".tmp-test-icon";
 
  }
}

const configuration=new Configuration();
module.exports=configuration;