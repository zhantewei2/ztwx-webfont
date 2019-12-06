const {root_join}=require("./tool");

class Configuration{
  get outputDir(){
    return root_join("dist/output")
  }
  get imgDir(){
    return root_join("dist/imgs")
  }
  get fontName(){
    return "helloBoy";
  }
  constructor(){
    this.formats=["woff","woff2"];
    this.className="fa";
  }
}

const configuration=new Configuration();
module.exports=configuration;