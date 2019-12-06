const http=require("http");
const {LoggerFactory} =require("../logger");

const log=LoggerFactory.getLogger(__filename);

const switchPortFn=(defaultPort,maxTry=20,cb)=>{

  let tryCount=0;
  const swithPort=(port)=>{
      port=port+tryCount;
      log.debug(`try port: ${port}`)
      const app=http.createServer(()=>{})
      app.on("error",(e)=>{
        app.close();
        if(tryCount>=maxTry){
          log.error("overide max try port");
          cb(false)
        }else{
          log.debug(`${port} has bean used...try next port`);
          tryCount++;
          swithPort(defaultPort)
        }
      })
      app.on("listening",()=>{
        app.close();
        cb(port);
      })
      app.listen(port);
  }
  swithPort(defaultPort);
}
module.exports=switchPortFn;