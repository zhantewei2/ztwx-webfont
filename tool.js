const path=require("path")

const rootPath=__dirname;

module.exports.run_promise=(fn,...args)=>
  new Promise((resolve,reject)=>{
    fn.call(fn,...args,(err,result)=>{
        if(err)return reject(err);
        resolve(result);
      })
  });


module.exports.root_join=(...args)=>path.join(rootPath,...args)
