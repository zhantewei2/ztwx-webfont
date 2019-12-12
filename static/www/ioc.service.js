import {typeColors,loggerLevel} from "./resources/app.config.js";
import {NzxAnimation,mixin_buildVariousColor,NzxDisplayAn,ConvertColor,LoadCss} from "./utils.js";
import {Logger} from "./common/logger.js";
import {CommonService} from "./common/common.service.js";
import {ajax} from "./ajax.js";

window.nzxAjax=ajax;
class IOC{
  constructor(){
    this.container=[];
  }
  bean(name,build){
    this.container.push({
      name,
      builder:build()
    })
  }
  autoWired(name,bindComponent){
    const i =this.container.find(i=>i.name==name);
    bindComponent[name]=i.builder;
  }
  getInjection(name){
    return this.container.find(i=>i.name==name).builder;
  }
}
const ioc=new IOC();
window.ioc=ioc;

ioc.bean("anDisplay",()=>NzxDisplayAn);
ioc.bean("animation",()=>NzxAnimation);
ioc.bean("typeColors",()=>typeColors);
ioc.bean("mixin_colors",()=>mixin_buildVariousColor);
ioc.bean("log",()=>new Logger(loggerLevel));
ioc.bean("convert_color",()=>new ConvertColor());
ioc.bean("commonService",()=>new CommonService());


/**
 * css module
 */
//从module构建全局style
const loadCss=new LoadCss();
loadCss.load("/public/module.scss");
const insertDom=document.createElement("aside");
document.body.appendChild(insertDom);
loadCss.loadModule("moduleBtn",insertDom);
loadCss.loadModule("moduleList",insertDom);

ioc.bean("loadCss",()=>loadCss);

/**
 * animation
 * 
 */
window.NzxAnimation=NzxAnimation;
