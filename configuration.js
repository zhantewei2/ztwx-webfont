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
  //webfont server使用的font 文件名。不可更改
  get currentFontName(){
    return "nzx";
  }
  constructor(){
    this.formats=["woff","woff2"];
    // 该值可传递给wefont frontend ，动态设置
    this.className="na";
    this.tmpProfileDirName=".tmp-test-icon";
 
  }
}

const configuration=new Configuration();
module.exports=configuration;