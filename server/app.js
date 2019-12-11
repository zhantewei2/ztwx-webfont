const {Server,Static,Router} =require('@ztwx/ztw-server');
const configuration=require("../configuration");
const switchPort=require("./switchPort");
const {root_join} =require("../tool");
const open=require("open")
const {LoggerFactory}=require("../logger");
const mainController=require("./controller/mainController");
const log=LoggerFactory.getLogger(__filename);

switchPort(3000,20,(port)=>{

  const app=new Server();
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
