const {Server,Static,Router} =require('@ztwx/ztw-server');
const configuration=require("../configuration");
const switchPort=require("./switchPort");
const {root_join} =require("../tool");
const open=require("open");
const {LoggerFactory}=require("../logger");
const mainController=require("./controller/mainController");
const log=LoggerFactory.getLogger(__filename);
const BaseException=require("./exceptions/BaseException");

const parseBody=ctx=>()=>new Promise((resolve,reject)=>{
  let content="";
  ctx.req.on("data",chunk=>{
    content+=chunk.toString()
  });
  ctx.req.on("end",()=>{
    try{
      resolve(JSON.parse(content))
    }catch(e){
      reject(e)
    }
  })
  ctx.req.on("error",e=>reject(e));
});


switchPort(3000,20,(port)=>{

  const app=new Server();
  app.use(async(ctx,next)=>{
    try{
      await next()
    }catch(e) {
      if (e instanceof BaseException){
        log.error(e.message);
        log.error(e.error);
        ctx.res.statusCode=e.status;
        ctx.res.end(e.message);
      }
    }
  });
  app.use(async(ctx,next)=>{
    ctx.getBodyJSON=parseBody(ctx);
    await next();
  });

  app.use(mainController);
  app.use(Static('',
    root_join("static"),
    {
      etag:true,
      callback:"www/showIcon.html"
    }
  ));
  app.use(ctx=>{
    ctx.body="end";
  })
  app.listen(port);
  setTimeout(()=>{
    log.info("----server initialize-----")
    // open(`http://localhost:${port}/index.html`)
  },1000)
})
