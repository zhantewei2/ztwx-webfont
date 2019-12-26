const {Router} =require('@ztwx/ztw-server');
const {
  getIconList,
  buildIconList,
  getBaseConfiguration,
  deleteIcon,
  modifyIcon
} =require("../service/mainService");

const {tryBuildFileService}=require("../service/buildService");
const BaseException=require("../exceptions/BaseException");
const {LoggerFactory} =require("../../logger");
const fs=require("fs");
const path=require("path");
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
    //文件已存在
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

/**
 * 获取 webfont 的配置信息
 * 如 class名 na 或 fa
 */
router.get("base-config",async(ctx)=>{
  ctx.body=await getBaseConfiguration();
})

router.put("icons",async(ctx)=>{
  try{
    const params=await ctx.getBodyJSON();
    const iconExists=await tryBuildFileService.findIconExists(params.newName+".svg");
    log.debug("icon new name: "+params.newName);
    if(iconExists)return ctx.body="2";

    await modifyIcon(
      params.iconName,
      params.newName,
      params.sourcePosition.join(path.sep)
    )
    await buildIconList();
    log.info(`change ${params.iconName} to ${params.newName},successfull`);
    ctx.body="1";
  }catch(e){
    if (e instanceof BaseException)throw e;
    log.error(e)
    ctx.body="0";
  }
})

router.post("deleteIcons",async(ctx)=>{
  try{
    const params=await ctx.getBodyJSON();
    await deleteIcon(params.iconName,params.sourcePosition.join(path.sep));
    await buildIconList();
    log.info(`${params.iconName} , delete successfull`);
    ctx.body="1";
  }catch(e){
    if(e instanceof BaseException)throw e;
    log.error(e)
    ctx.body="0";
  }
});
module.exports=router.routes();