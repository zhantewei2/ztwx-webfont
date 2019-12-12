export class ModifyIcon{
    constructor(bindContainerEl){
        ioc.autoWired("animation",this);
        this.wrapper=bindContainerEl;
        bindContainerEl.addEventListener("click",e=>{
            const targetNode= e.target;
            const iconItem=this.findBtnEl("icon-item",targetNode);
            if(!iconItem)return;
            this.createIconDialog(iconItem);
            
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
            this.body.appendChild(this.bg);
        }else{
            this.body.removeChild(this.bg);
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
        this.bg.appendChild(cloneEl);
        this.dialog=cloneEl;
        this.originEl=el;
        this.dialogAn=new this.animation(this.dialog,"transition");
        this.showDialog();
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
        this.dialogAn.leave("icon-dialog-leave","",()=>{
            this.showBg=false;
            this.originEl.classList.remove("icon-dialog-cover");
        });
    }

    getCloneIcon(el){
        const rect=el.getBoundingClientRect();
        const cloneNode=el.cloneNode(true);
        cloneNode.style.position="fixed";
        cloneNode.style.top=rect.top;
        cloneNode.style.left=rect.left;
        cloneNode.style.width=rect.width+"px";
        cloneNode.style.height=rect.height+"px";
        cloneNode.classList.add("icon-item-hover");
        cloneNode.addEventListener("click",e=>{
            e.selfStop=true;
        })
        const content=cloneNode.querySelector(".icon-content");

        this.editContainer.innerHTML=`
    <div class="empty-list">
        修改
    </div>    
    <div class="btn bg-error">
        删除
    </div>
    <div class="btn bg-outline">
        关闭
    </div>
        `;
        console.log(this.editContainer,content);
        cloneNode.appendChild(this.editContainer);

        return cloneNode;
    }
}