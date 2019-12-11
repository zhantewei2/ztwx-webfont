import {NzxAnimation} from "/www/utils.js";

class PropCard extends HTMLElement{
  constructor(){
    super();
    this.shadow=this.attachShadow({mode:"open"});
    ioc.autoWired("log",this);
    this.shadow.innerHTML=`
    <style>
    @keyframes propFadeIn{
      from{opacity:0}
      to{}
    }
    @keyframes propContentEnter{
      from{transform:translateY(-100%)}
      to{}
    }

    .nzx-propCard{
      z-index:var(--index-prop-bg);
      position:fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
  
      background:rgba(0,0,0,0.4);
      animation:propFadeIn .3s ease;
    }
    .nzx-propCard>._content{
      animation:propContentEnter .2s ease-out;
      transition:all .2s ease-out;
      background:var(--color-bg);
      padding:30px;
      padding-top:50px;
      box-shadow:var(--shadow-prop)
    }
    .prop_transition{
      transition:all .3s ease;
    }
    .prop_leave{
      opacity:0;
    }
    .prop_leave>._content{
      transform:translate3d(0,-100%,0)
    }
    </style>
    <div class="nzx-propCard">
      <main class="_content">
    
        <slot name="content"></slot>
      </main>
    </div>
    `;
    ioc.autoWired("anDisplay",this);
    const content=this.shadow.querySelector(".nzx-propCard ._content");
    const wrapper=this.shadow.querySelector(".nzx-propCard");
    const wrapperAnimation=new NzxAnimation(wrapper,"prop_transition");
    let is_uploading;
    this.uploadOrder=window.globalStore.subscribe(({type,payload})=>{
      this.log.debug(type,payload);
      if(type=="upload action"){
        is_uploading=payload;
      }
    })

    content.addEventListener("click",e=>{
      e.selfStop=true;
    })
    wrapper.addEventListener("click",e=>{
      if(e.selfStop)return;
      closeProp();
    })
    
    const closeProp=()=>{
      if(is_uploading)return;
      wrapperAnimation.leave("prop_leave",this);  
    }
  }

  disconnectedCallback(){
    this.log.debug("disconnected unsubscribe")
    this.uploadOrder.unsubscribe();
  }
}


class Icon extends HTMLElement{
  constructor(){
    super();
    this.innerHTML="<i class='na na-upload'></i>"
  }
}

class UploadPlate extends HTMLElement{
  set loading(value){
    if(value){
      this.wrapper.classList.add("disabled-loading");
      this.uploadLoadingRef.show();
    }else{
      this.wrapper.classList.remove("disabled-loading");
      this.uploadLoadingRef.close();
    }
  }
  upload(filename,buffer){
    if(!this.checkFilename(filename)){
      return;
    }
    
    window.globalStore.next({
      type:"upload action",
      payload:true
    })
    window.nzxAjax.up("/upload-icon",{filename},buffer).then(result=>{
      window.globalStore.next({
        type:"upload action",
        payload:false
      })
      console.log(result)
      if(result.status!=200){
        this.messageService.show("error","服务器未知错误")
        
      }else{
        const content=result.content;
      
        if(content==1){
          this.log.debug("该名称图片已存在");
          this.alert.show("warn","图标名重复，请更改名称");
          this.editFilename=true;
        }else if(content==2){
          this.log.debug("the uploaded file dose not conform to the specification");
          this.alert.show("error","上传的图标文件不符合规范")
        }else if(content==3){
          this.log.debug("icon list compiler fails")
          this.alert.show("error","字体生成失败，请查看server日志")
        }else if(content==202){
          this.messageService.show("success","字体构建成功，即将重新载入字体")
          setTimeout(()=>{
            this.commonService.reloadPage();
          },500);
        }
      }
    })
  }
  fileNameExists(){
    
  }
  checkFilename(filename){
    try {
      const suffix = filename.slice(filename.lastIndexOf(".") + 1);
      if (suffix != "svg"){
        throw "missing svg";
      }
    }catch (e) {
      this.log.debug("missing image extend type");
      this.alert.show("error","图片必须为svg格式");
      return false;
    }
    return true;
  }

  set fileName(name){
    this._filename=name.trim();
    if(this.editAsideContent_element)this.editAsideContent_element.innerHTML=this._filename;
  }
  get fileName(){
    return this._filename;
  }

  set uploadDisabled(val){
    if(!this.fileName)val=true;
    if(val){
      this.uploadBtn.setAttribute("disabled",true);
    }else{
      this.uploadBtn.removeAttribute("disabled");
    }
  }

  set editFilename(edit){
    if(edit){
      this.editAsideContent_element.style.display="none";
      this.editAsideInput_element.value=this.fileName;
      this.editAsideInput_an.show(()=>{
        this.editAsideInput_element.focus();
      });
      this.uploadDisabled=true;
    }else{
      this.editAsideInput_an.hide(()=>{
        this.editAsideContent_element.style.display="block";
        this.fileName=this.editAsideInput_element.value;
        this.uploadDisabled=false;
      });
    }
  }
  disconnectedCallback(){
    this.storeOrder.unsubscribe();
  }
  constructor(){
    super();
    this.innerHTML=`
    <div class="upload-alert-container">
      <ztwx-alert></ztwx-alert>
    </div>
    <div class="flex flex-hor-center an" id="upload-wrapper">
      <div class="upload-btn">
        <main>
          <i class="na na-upload"> </i>
        </main>
        <input type="file"/>
        <div id="imgContainer">
          <img />
          <span>
            <i class="na na-close"></i>
          </span>
        </div>
      </div>
    </div>
    <nzx-loading id="upload-loading" class="upload-wrapper-load"></nzx-loading>
    `   
    ioc.autoWired("messageService",this);
    ioc.autoWired("log",this);
    ioc.autoWired("anDisplay",this);
    ioc.autoWired("commonService",this);
    setTimeout(()=>{
      this.commonService.reloadPage();
    },1000);
    this.style.position="relative";
    this.style.display="block";
    this.alert=this.querySelector("ztwx-alert");
    const fileInput=this.querySelector("input");
    const imgContainer=this.querySelector("#imgContainer");
    const inputMain=this.querySelector("main");
    imgContainer.style.display="none";
    const img=imgContainer.querySelector("img");
    const closeIcon=imgContainer.querySelector("span");
    const wrapper=this.wrapper=this.querySelector("#upload-wrapper");
    const handleWrapper=document.createElement("div");
    handleWrapper.className="an-side-enter";
    this.uploadLoadingRef=this.querySelector("#upload-loading");
    const handleHtml=`
    <div class="upload-handle-container flex-vertical-between" style="height:100%">
      <main class="list-group">
        <div class="list-item">
          <label>文件名</label>
          <aside class="exhibition-input-container">
            <span class="an-fade-enter"></span>
            <input class="base-input" />
          </aside>
        </div>
      </main>
      <button class="btn btn-round-lg">
        <i class="na na-upload-mini"></i>
      </button>
    </div>
    `;
    handleWrapper.innerHTML=handleHtml;
    const uploadBtnAn=new NzxAnimation(handleWrapper,"an-side-transition");
    const uploadBtn=this.uploadBtn=handleWrapper.querySelector(".btn-round-lg");
    this.editAsideContent_element=handleWrapper.querySelector("aside span");
    this.editAsideInput_element=handleWrapper.querySelector("aside input");

    this.editAsideInput_an=new this.anDisplay(this.editAsideInput_element,"exhibition-editInput-an","transition");

  /** 
   * handle upload
   * **/

   this.storeOrder=window.globalStore.subscribe(({type,payload})=>{
     if(type=="upload action"){
       this.loading=payload
     }
   })
  /**
   * handle filename change 
   * 
   */

    this.editAsideContent_element.onclick=()=>{
      this.editFilename=true;
    }
    this.editAsideInput_element.onkeydown=(e)=>{
      if(e.key.toString().toLowerCase()=="enter"){
        this.editFilename=false;
      }
    }
    this.editAsideInput_element.addEventListener("blur",()=>{
      this.editFilename=false;
    })

  /**
   * handle others
   * 
   */
    let fileBuffer=null;
    this.fileName="";
    uploadBtn.addEventListener("click",()=>{
      if(!this.fileName||!fileBuffer)return;
      this.upload(this.fileName,fileBuffer);
    });

    const imgContainerClear=(leave=true)=>{
      img.src="";
      imgContainer.style.display="none";
      inputMain.style.display="block";
      fileInput.value=this.fileName="";
      
      if(leave)uploadBtnAn.leave("an-side-leave");
      fileBuffer=null;
    };
    const imgContainerShow=(imgData)=>{
      imgContainer.style.display="block";
      inputMain.style.display="none";
      
      if(imgData){
        img.src=imgData;
        wrapper.appendChild(handleWrapper);
      }
    };

    const loadImg=(file)=>{
      const rf=new FileReader();
      const rfBuffer=new FileReader();
      if(!this.checkFilename(file.name)){
        imgContainerClear(false);
        return;
      }
      this.fileName=file.name;
      rf.onloadend=(e)=>{
        const base64Content=e.target.result;
        imgContainerShow(base64Content);
      }
      rf.readAsDataURL(file);

      rfBuffer.onloadend=(e)=>{
          fileBuffer=e.target.result;
      };
      rfBuffer.readAsArrayBuffer(file);
    };

    closeIcon.addEventListener("click",imgContainerClear);

    fileInput.onchange=(e)=>{
      const file=e.target.files[0];
      if(!file)return;
      loadImg(file)
    }

  }
  connectedCallback(){}

}



class nzxUpload extends HTMLElement{
  constructor(){
    super();
    this.shadow=this.attachShadow({mode:"open"});
    this.shadow.innerHTML=`
    <button class="nzx-btn">upload</button>
   `;
    window.nzxCssModule.loadModule("moduleBtn",this.shadow)
  }
  connectedCallback(){
    const uploadBtn=this.shadow.querySelector(".nzx-btn");


    uploadBtn.addEventListener("click",()=>{
      const prop=document.createElement("nzx-propcard");
      prop.innerHTML=`
        <nzx-uploadplate slot="content">content</nzx-uploadplate>
      `;
      document.body.appendChild(prop);

    });
    const prop=document.createElement("nzx-propcard");
    prop.innerHTML=`
      <nzx-uploadplate slot="content"></nzx-uploadplate>
    `
    document.body.appendChild(prop);

  }


}

window.customElements.define("nzx-propcard",PropCard);
window.customElements.define("nzx-upload",nzxUpload);
window.customElements.define("nzx-uploadplate",UploadPlate);
window.customElements.define("nzx-icon",Icon);

export {
  nzxUpload
}
