const path=require("path");
const fs=require("fs");

p=path.join(process.cwd(),"static/ztw/ztw2");

fs.mkdirSync(p,{recursive:true})