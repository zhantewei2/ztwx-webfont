const prefix_id="ztx-icons";

export class ModifyIcon{
    constructor(bindContainerEl){
        ioc.autoWired("animation",this);
        ioc.autoWired("snackService",this);
        ioc.autoWired("log",this);
        ioc.autoWired("pageloadingService",this);
        ioc.autoWired("messageService",this);
        ioc.autoWired("anDisplay",this);
        this.wrapper=bindContainerEl;
        this.iconItem=null;
        this.iconsContainer=document.querySelector(".icons-container");
        this.modifyDupErrorShow=false;

        const idarr=bindContainerEl.id.split("-");
        
        this.sourcePosition=idarr.slice(2,idarr.length-1);
        bindContainerEl.addEventListener("click",e=>{
            const targetNode= e.target;
            this.iconItem=this.findBtnEl("icon-item",targetNode);
            if(!this.iconItem)return;
            this.createIconDialog(this.iconItem);
            
        })
        this.body=document.body;
        this.bg=document.createElement("div");
        this.bg.className="icon-dialog-bg";
        this.bg.addEventListener("click",(e)=>{
            if(e.selfStop)return;
            this.closeDialog()
        });
        this.dialog=null;
        this.originEl=null;
        this.dialogAn=null;

        this.editContainer=document.createElement("div");
        this.editContainer.className="icon-edit-content list-group";
    }

    set showBg(val){
        if(val==this._showBg)return;
           
        if(val){
            document.documentElement.appendChild(this.bg);
            this.iconsContainer.classList.add("bg-blur");
        }else{
            document.documentElement.removeChild(this.bg);
            this.iconsContainer.classList.remove("bg-blur")
        }
        this._showBg=val;
    }

    findBtnEl(className,triggerNode){
        if(triggerNode==this.wrapper)return null;
        if(triggerNode.className==className)return triggerNode;
        return this.findBtnEl(className,triggerNode.parentElement);
    }

    createIconDialog(el){
        const cloneEl=this.getCloneIcon(el);
        this.showBg=true;
        this.closeDecorator=this.createCloseDecorator();
        this.bg.appendChild(cloneEl);
        this.bg.appendChild(this.closeDecorator);
        this.dialog=cloneEl;
        this.originEl=el;
        this.dialogAn=new this.animation(this.dialog,"icon-dialog-transition");
        this.showDialog();
    }
    createCloseDecorator(){
        const closeWrapper=document.createElement("span");
        closeWrapper.innerHTML=`
  <div class="btn-icon icon-item-close">
        <img src="/public/images/close-black.svg" />
   </div>
        `
        return closeWrapper;
    }

    showDialog(){
        this.shows0=setTimeout(()=>{
            this.shows0=null;
            //bg
            this.showBg=true;
            //dialog
            this.dialog.classList.add("icon-dialog-show");
            //origin
            this.originEl.classList.add("icon-dialog-cover");
            //bg
            this.shows1=setTimeout(()=>{
               this.dialog.classList.add("icon-dialog-show-secondary") 
            },100);
        },100);
        
    }
    closeDialog(){
        if(this.shows0){
            clearTimeout(this.shows0);
            this.shows0=null;
        }
        if(this.shows1){
            clearTimeout(this.shows1);
            this.shows1=null;
        }
        this.bg.removeChild(this.closeDecorator);
        this.dialogAn.leave("icon-dialog-leave","",()=>{
            this.showBg=false;
            this.originEl.classList.remove("icon-dialog-cover");
        });
    }

    renderModifyTp(inputValue){
        if(this.modifyEl){
            this.modifyInput.value=inputValue;
            return;
        }
        const old=HTMLElement.addEventListener;
        HTMLElement.addEventListener=function(method,fn){
            old.call(this,method,fn);
        }
        const tp=`
    <div class="abs-tl btn-icon">
         <img src="/public/images/back-out.svg" />
    </div>
    <div style="margin-top:40px;">
        ${this.cloneNode.querySelector(".icon-svg").outerHTML}
        <main class="icon-content">
                <nzx-input 
                disable-stretch="true"
                input-center="true"
                ></nzx-input>
        </main>
    </div>
     <footer class="icon-modify-footer">
        <div id="__confirm" class="btn bg-info focus-deep">确认</div>
    </footer>
        `
        const modifyEl=this.modifyEl=document.createElement("div");
        modifyEl.className="icon-dialog-item icon-item-hover icon-item icon-dialog-item-secondary";
        modifyEl.innerHTML=tp;
        this.dialog.appendChild(modifyEl);
        this.modifyAn=new this.anDisplay(modifyEl,"icon-modify-an","transition");
        this.modifyEl.value=inputValue;
        this.modifyInput=this.modifyEl.querySelector("nzx-input");
        this.modifyInput.value=inputValue;
        // const cancelBtn=this.modifyEl.querySelector("#__cancel");
        const article=this.modifyEl.querySelector("article");
        const backBtn=this.modifyEl.querySelector(".btn-icon");
        const footer=this.modifyEl.querySelector("footer");
        const confirm=this.modifyEl.querySelector("#__confirm");
        const footerAn=new this.anDisplay(footer,"icon-modify-footer-an","transition");
        this.footer_isShow=false;
        let inputValueCurrent=inputValue;
        backBtn.onclick=()=>{
            this.modifyInput.blur();
            setTimeout(()=>{
                this.modify=false;
            },10);
        }
        this.showSubmit=()=>{
            if(this.footer_isShow)return;
            this.footer_isShow=true;
            footerAn.show();
        }
        this.hideSubmit=()=>{
            if(!this.footer_isShow)return;
            footerAn.hide(()=>{
                this.footer_isShow=false;
            });
        }

        //监听 input change改变
        this.modifyInput.valueChange(v=>{
            v=v&&v.trim()||"";
            inputValueCurrent=v;
            v===inputValue||!v?this.hideSubmit():this.showSubmit();
        })
        this.mfLoading=false;
        const click=()=>{
            if(this.mfLoading)return;
            this.mfLoading=true;
            this.pageloadingService.show();
            const newName=this.modifyInput.value.trim();
            this.ajax_modifyIcon(inputValue,newName)
                .then((content)=>{
                    this.mfLoading=false;
                    this.pageloadingService.hide();
                    if(content==1){
                        this.messageService.show("success","图片名称已修改");
                        this.completedModify(newName);
                        //图片名重复
                    }else if(content==2){
                        this.modifyDupErrorShow=true;
                        this.snackService.open("alert-error","图片名重复",this.modifyInput).then(v=>{
                            this.log.debug("duplication image close cancel")
                            this.modifyDupErrorShow=false;
                        })
                    }else{
                        throw content;
                    }
                })
                .catch((e)=>{
                    this.mfLoading=false;
                    this.pageloadingService.hide();
                    this.messageService.show("error","图片修改失败");
                })
        }
        confirm.onclick=click;
        this.modifyInput.onEnter(()=>{
            if(this.mfLoading)return;
            if(this.modifyDupErrorShow){
                this.snackService.close(()=>this.modifyDupErrorShow=false);
                return;
            }
            if(inputValueCurrent!=inputValue)click();
            
        });
    }
    completedModify(newName){
        this.iconItem.dataset.name=newName;
        this.iconItem.querySelector(".icon-content-name").innerHTML=newName;
        this.closeDialog();
    }

    set modify(value){
        this.renderModifyTp(this.cloneNode.dataset.name);
        if(value){
            this.modifyAn.show(()=>{
                this.modifyInput.focus();
                this.modifyInput.select();
            })
            this.cloneAn.hide();
        }else{
            this.modifyAn.hide();
            this.cloneAn.show();
            this.hideSubmit();
            this.footer_isShow=false;
        }
    }

    getCloneIcon(el){
        this.modifyEl=null;
        const rect=el.getBoundingClientRect();
        const originNode=el;
        const cloneNode=el.cloneNode(true);
        this.cloneNode=cloneNode;
        this.cloneAn=new this.anDisplay(cloneNode,"icon-exhibition-an","transition");
        const wrapperNode=document.createElement("div");
        wrapperNode.style.position="fixed";
        wrapperNode.style.top=rect.top;
        wrapperNode.style.left=rect.left;
        wrapperNode.style.width=rect.width+"px";
        wrapperNode.style.height=rect.height+"px";
        wrapperNode.classList.add("icon-dialog-wrapper");
        cloneNode.classList.add("icon-item-hover","icon-dialog-item");
        wrapperNode.addEventListener("click",e=>{
            e.selfStop=true;
        })
        wrapperNode.appendChild(cloneNode);
        this.editContainer.innerHTML=`
    <div class="btn bg-outline focus-light" id="_edit_modify">
        修改
    </div>
    <div class="btn bg-error focus-deep" id="_edit_delete">
        删除
    </div>
        `;
        cloneNode.appendChild(this.editContainer);

        const modifyBtn=this.editContainer.querySelector("#_edit_modify");
        const delBtn=this.editContainer.querySelector("#_edit_delete");
        modifyBtn.onclick=()=>{
            this.modify=true;
        }
        delBtn.onclick=()=>{
            this.snackService.open("error","请确认删除该图标",delBtn)
            .then(result=>{
                if(result){
                    this.pageloadingService.show();
                    this.ajax_deleteIcon(cloneNode.dataset.name)
                    .then(content=>{
                        this.pageloadingService.hide();
                        if(content==1){
                            this.messageService.show("success","图标删除成功");
                            this.closeDialog();
                            originNode.parentNode.removeChild(originNode);
                        }else{
                            throw content;
                        }
                    })
                    .catch(()=>{
                        this.messageService.show("error","图标删除失败");
                    })
                }
            })
        }
        return wrapperNode;
    }
    ajax_deleteIcon(iconName){
        return window.nzxAjax.send("post","/deleteIcons",{
            "sourcePosition":this.sourcePosition,
            iconName
        })
        .then(result=>{
            if(result.status!=200)return Promise.reject("failure");
            return result.content;
        })
    }
    ajax_modifyIcon(iconName,newName){
        return window.nzxAjax.send("put","icons",{
            "sourcePosition":this.sourcePosition,
            iconName,
            newName
        })
        .then(({status,content})=>{
            if(status!=200)return Promise.reject("failure");
            return content;
        })
    }
}