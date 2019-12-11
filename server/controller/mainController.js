const {Router} =require('@ztwx/ztw-server');
const {
  getIconList,
  buildIconList
} =require("../service/mainService");

const {tryBuildFileService}=require("../service/buildService");

const {LoggerFactory} =require("../../logger");

const log=LoggerFactory.getLogger(__filename);
const urllib=require("url");
const querystring=require("querystring");

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
    const params=querystring.parse(urllib.parse(ctx.req.url).query);
    const filename=params["filename"];
    const filedir=params["filedir"];
    log.debug("upload icon :"+filename);
    if(!filename)return ctx.body="0";
    const iconExists=await tryBuildFileService.findIconExists(filename);
    if(iconExists)return ctx.body="1";
    //检查文件夹
    await tryBuildFileService.checkDir();
    //存放临时图标
    await tryBuildFileService.buildTmpIcon(ctx.req,filename);
    //尝试构建
    try {
        await tryBuildFileService.attemptBuild();
    }catch (e) {
        return ctx.body="2"
    }
    //移动图片至公共文件
    await tryBuildFileService.copyTmpIcon(filename);
    try{
      await buildIconList();
    }catch(e){
      log.error("build icon list failure!")
      log.error(e);
      return ctx.body="3";
    }
    ctx.body="202";
});

module.exports=router.routes();