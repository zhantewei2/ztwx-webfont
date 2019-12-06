const fs=require('fs');
const {join} =require('../config');
const {run_promise} =require('../tool');
const dir=join('static/icon');



module.exports=async()=>{
  const filenames=await run_promise(fs.readdir,dir);
  return JSON.stringify(filenames);

};