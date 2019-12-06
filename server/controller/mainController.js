const {Router} =require('@ztwx/ztw-server');
const {
  getIconList,
  buildIconList
} =require("../service/mainService");

const {LoggerFactory} =require("../../logger");

const log=LoggerFactory.getLogger(__filename);

const router=new Router();


router.get('icons',async(ctx)=>{
  log.debug("get icon list")
  const list=await getIconList();
  ctx.body=JSON.stringify(list);
});

//make icons font file
router.post("icons",async(ctx)=>{
  log.debug("remake icons files...")
  try{
    await buildIconList();
    ctx.body="completed!";

  }catch(e){
    log.error(e)
    log.error("build icon failure");
    ctx.res.statusCode=400;
    ctx.res.end("failure")
  }
});

router.post("upload-icon",async(ctx)=>{
  log.debug("upload icon");
  console.log(ctx.req.url);
})

module.exports=router.routes();