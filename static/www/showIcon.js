import "/www/ioc.service.js";

import "/www/store/global.store.js";
import "/www/components/components.js";

// 注入 全局ioc容器组件
ioc.bean("messageService",()=>document.querySelector("body>ztwx-message"));
ioc.bean("pageloadingService",()=>document.querySelector("body>ztwx-pageloading"));
ioc.bean("snackService",()=>document.querySelector("body>ztwx-snack"));

import {ModifyIcon} from "./components/modifyIcon.js";

import {ajax} from "/www/ajax.js";
import "/www/loading.js";


import {modal} from '/www/modal.js';
import '/www/input.js';
import "/www/upload.js"


class ShowIcon extends HTMLElement{
  constructor(props) {
    super(props);
    this.shadow=this.attachShadow({mode:'open'});
    this.iconsContainer=document.body.querySelector("#icons-container");
    this.buildContainerBg();
    this.config={
      prefix:""
    };
    this.iconObj={};
    ioc.autoWired("pageloadingService",this);
    ioc.autoWired("messageService",this);
    ioc.autoWired("log",this);
    ioc.autoWired("commonService",this);
    
    const baseContent=``;
    this.shadow.innerHTML=`
    <style>
      main{
        display:flex;
        flex-flow:wrap;
        color:rgba(0,0,0,0.76)
      }
      i{
        font-size:20px;
      }
      p{color:red}
      .card{
          padding:1rem;
          margin:0.5rem;
          box-shadow:0 1px 12px -6px gainsboro;
          border-radius:10px;
          width:100px;
          transition:all .3s ease;
      }
      .card:hover{
        background-color:rgb(230,230,230);
        cursor: pointer;
      }
      .card .content{
        text-align: center;
        line-height: 30px;
        height:30px;
      }
      .card footer{
        text-align:center;
        font-size:14px;
      }
      .input-top{
        height:var(--header-height);
        padding:10px;
        box-sizing: border-box;
        padding-left:2rem;
        display:flex;
        justify-content:space-between;
      }
      .fixer-top{
        position:fixed;
        top:0;
        background:white;
        box-shadow:0 1px 12px -3px rgba(0,0,0,0.2);
        width:100%;
        left:0;
        z-index:10;
      }

    </style>
    <div class="input-top fixer-top">
      <nzx-input placeholder="search icon"></nzx-input>
      <nzx-upload></nzx-upload>
    </div>
    <div class="input-top"></div>
    <main>
      ${baseContent}
    </main>
    `;
    this.input=this.shadowRoot.querySelector('nzx-input');
    
    this.main=this.shadowRoot.querySelector('main');
      

  }
  /**
   * 直接构建字体
   */
  buildIcons(){
     return ajax.send("post","/icons").then(res=>{
      if(res.status==400){
        this.messageService.show("error","图标构建失败");
        this.log.error(res)
      }else{
        this.log.debug("直接构建ICON SUCCESSFUL");
      }
    })
  }
  /**
   * 获取字体列表
   */
  getIcons(next){
    return ajax.send("get","/icons").then(res=>{
      if(res.status!=200)throw `res.status: ${res.status}`;
      //to 处理字体列表
      this.handleIconList(JSON.parse(res.content));
      next&&next();
    }).catch(e=>{
      this.messageService.show("error","字体列表获取失败");
      this.log.error("Font list failed to get: "+e);
    })
  }
  /**
   * 创建 iconsContainers 背景
   */
  buildContainerBg(){
    
    // const bgImg=document.createElement("img");
    // bgImg.className="bg-img";
    // bgImg.src="/public/bg/bg.svg";
    // this.iconsContainer.appendChild(bgImg);
  }
  /**
   * 处理ICON list 信息
   */
  handleIconList(list){
    /**
     * listItem{
     *  name:string;
     *  children?:listItem[],
     *  type?:"dir"
     * }
     *  
     * RefObj{
     *  default: listitem[] 
     *  [refObj],
     * }
     */
    this.iconsContainer.appendChild(this.styleContainers);
    if(!list || !list.length){
      this.iconsContainers.innerHTML=`
<div>
    
</div>
    
    `
      return;
    }
    const orderList=(list,refObj)=>{
      const listPre=[];
      const listOrder=[];
      let iconName;
      let extendIndex;
      for(let i of list){
        if(i.type=="dir"){
            if(!refObj[i.name])refObj[i.name]={
              default:[]
            }
            orderList(i.children,refObj[i.name]);
        }else{
          iconName=i.name;
          extendIndex=iconName.lastIndexOf(".svg");
          if(extendIndex<=0)continue;
          i.name=iconName.slice(0,extendIndex);
          refObj["default"].push(i);
        }
      }
    }
    this.iconObj={
      default:[]
    }
    orderList(list,this.iconObj);
    
    this.log.debug(this.iconObj); 
    const htmlContent=this.renderRefObj(this.iconObj,"ztx-icons");
    

    // const htmlContent=handleList(list);
    
    this.iconsContainers.innerHTML=htmlContent;

    
    this.iconsContainer.appendChild(this.iconsContainers);
    this.handleIconArticle();
  }
  sortRefObjKeys(refObjKeys){
    const preArr=[];
    const nextArr=[];
    refObjKeys.forEach(key=>key=="default"?preArr.push(key):nextArr.push(key));
    return preArr.concat(nextArr);
  }
  renderRefObj=(refObj,id)=>{
    let articleId;
    return this.sortRefObjKeys(Object.keys(refObj)).map(key=>{
      articleId=id+"-"+key;
      if(key=="default"){
        return `
  <div class="icon-article" id="${articleId}">
    <label>
        <nzx-input>
          <img class="search-icon" src="/public/images/search.svg" slot="prefix" />
        </nzx-input>
    </label>
    <artilce class="icon-article-content">
        ${this.renderIcons(refObj[key])}
    </article>
  </div>
        `
      }else{
        return `
  <aside class="icon-article-children">
      ${this.renderRefObj(refObj[key],articleId)}
  <aside>
        `
      }
    }).join("");
  }
  renderIcons=(iconList)=>{
    return iconList.map(iconRef=>this.renderIcon(iconRef)).join("");
  }
  renderIcon=({name})=>{
    return `
    <div class="icon-item" data-name="${name}">
      <div class="icon-svg"><i class="${this.config.prefix} ${this.config.prefix}-${name}"></i></div>
      <div class="icon-content">
        <div class="icon-content-name">${name}</div>
      </div>
    </div>
    `
  }

  connectedCallback(){
    this.styleContainers=document.createElement("style");
    this.iconsContainers=document.createElement("article");
    this.iconsContainers.classList.add("icons-container");
    /**
     * Store 订阅
     * 
     */
    this.globalStoreOrder=window.globalStore.subscribe(({type,payload})=>{
      if(type=="font reloading"){
        if(payload){
          //加载开始
          this.pageloadingService.show();
        }else if(payload===null){
          //加载成功
          this.pageloadingService.hide();
          this.messageService.show("success","字体加载完成")
          this.getIcons(()=>{
            //高亮当前生成的icon
            this.highlightIcon();
          });
        }else if(payload===false){
          //加载失败
          this.pageloadingService.hide();
        }
      }
    })

    /**
     * 初始化图标
     */
    this.buildDefault();
  }

  /**
   * 高亮刚生成的图标
   */
  highlightIcon(){
    const filename=window.globalStore.select(state=>state.preFilename);
    const justNowIconEl=this.iconsContainers.querySelector(`[data-name="password"`);
    if(filename){
      this.log.debug("pre filename:"+filename);
      const justNowIconEl=this.iconsContainers.querySelector(`[data-name='${filename}']`);
      if(justNowIconEl){
        const bodyTop=this.commonService.getOffsetTop(justNowIconEl);
        this.log.debug(bodyTop);
        // justNowIconEl.scrollIntoView();
        document.body.scrollTo({
          top:bodyTop-100,
          behavior:"smooth"
        });
        justNowIconEl.classList.add("icon-highlight");
        setTimeout(()=>{
          justNowIconEl.classList.remove("icon-highlight");
        },2000)
      }
    }
  }
  initStyle(){
    const fa=this.config.prefix;
    const styles=``;
    this.styleContainers.innerHTML=styles;
    return Promise.resolve();
  }
  /**
   * 默认初始化构建一次
   */
  buildDefault(){
    this.pageloadingService.show();
    this.getConfiguration()
    .then(()=>this.initStyle())
    .then(()=>this.buildIcons())
    .then(()=>{
        this.commonService.reloadPage();
      })
      .catch((e)=>{
        this.log.error("初始化构建图标失败",e);
        this.pageloadingService.hide();
        this.messageService.show("error","初始化构建图标失败");
      })
  }


  findObjListFromId(id){
    const list=id.split("-").slice(2);
    let objRef;
    list.forEach((i,index)=>{
      if(index==0){
        objRef=this.iconObj[i];
      }else{
        objRef=objRef[i]
      }
    })
    return objRef;
  }
 /**
  * 生成article 区域
  */
  handleIconArticle(){
    const iconArticles=this.iconsContainers.querySelectorAll(".icon-article");
    iconArticles.forEach(i=>{
      //初始化icon修改
      new ModifyIcon(i);
      const id=i.id;
      const nzxInput=i.querySelector("nzx-input");
      let oldArticle=i.querySelector(".icon-article-content");
      const objList=this.findObjListFromId(id);
      let preValue="";
      let cacheArticle=oldArticle;
      let oldHtml="";

      nzxInput.execute=(value)=>{
        value=value.trim();
        if(value==preValue)return;
        if(!value){
          if(oldArticle!=cacheArticle){
            i.removeChild(oldArticle);
            i.appendChild(cacheArticle);
            oldArticle=cacheArticle;
          }
        }else{
          const article=document.createElement("article");
          article.className="icon-article-content";
          const resultList=this.searchIconFromList(value,objList)
          const resultHtml=this.renderIcons(resultList);
          if(resultHtml==oldHtml)return;
          article.innerHTML=resultHtml;
          i.removeChild(oldArticle);
          i.appendChild(article);
          oldArticle=article;
          oldHtml=resultHtml;
        }
        preValue=value;
      }
    })
  }
  searchIconFromList(name,list){
    const resultList=[];
    for(let i of list){
      if(i.name.match(name))resultList.push(i);
    }
    return resultList;
  }
 /**
   * 获得webfont配置信息
   */
  getConfiguration(){
    return ajax.send("get","base-config")
    .then(res=>{
      const config=JSON.parse(res.content);
      this.log.debug("webfont config:",config);
      this.config["prefix"]=config["fontPrefix"];
      //提交信息配置
      window.globalStore.commit("load config end",state=>{
        return {
          ...state,
          config:{
            ...config
          }
        }
      })
    })
  }

  disconnectedCallback(){
    this.globalStoreOrder.unsubscribe();
  }
};

window.customElements.define('ztwx-showicon',ShowIcon);

