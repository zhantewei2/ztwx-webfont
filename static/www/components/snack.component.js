export class SnackComponent extends HTMLElement{
    render(){
        return `
<style>
:host{
    --article-h:60px;
    --article-h2:70px;
}
 article{
    border-radius:var(--radius-card);
    padding:0 1rem;
    position:absolute;
    height:var(--article-h);
    display:none;
    opacity:1;
    line-height:var(--article-h);
    border:1px solid var(--color-softbg);
    background:var(--color-bg);
    transform-origin:0% 100%;
    transition: all .2s ease;
    align-items:center;
}

article:hover{
    transform:translate3d(0,-5%,0);
}
.bg{
    z-index:300;
    top:0;
    left:0;
    height:100%;
    position:fixed;
    width:100%;
    background:transparent;
    display:none;
}
.content{
    min-width:120px;
    font-size:13px;
    color: var(--icon-color);
    padding:0 1rem;
}
 .snack-an-show-start{
    opacity:0;
    transform:translate3d(0,50%,0);
}
 .snack-an-hide-end{
    transform:translate3d(0,50%,0);
    opacity:0;
 }
 .snack-transition{
     transition:all .2s ease;
 }
 .snack-btn{
    background:transparent;
    font-size:13px !important;
    color: var(--icon-des-active);
 }
 .snack-primary{
    color:var(--color-primary);
 }
 .snack-cancel{
    color:var(--color-primary);
 }
 article aside{
    display:flex;
    align-items:center;
 }
.btn:hover{
    transform:scale(1.2,1.2);
}
.img-icon{
    width:25px;
    height:25px;
    display:none;
}
 ${this.mixin_colors((color,value,fontValue)=>`
    .snack-type-${color}{
        box-shadow: 1px 12px 24px -14px ${this.convert_color.opacity(value,0.2)},1px 6px 16px -8px rgba(0,0,0,.2);
    }
    .snack-type-${color}.alert .content{
        color:${fontValue};
    }
    .snack-type-${color}.alert{
        border:1px solid ${value};
    }
    .snack-type-${color} .btn{
        color:${value}
    }
 `)}
 .alert .snack-cancel{
     display:none;
 }


</style>
<main class="bg">
<article>
    <img  class="img-icon"/>
    <label class="content">
    </label>
    <aside>
        <button class="btn snack-btn snack-primary">确认</button>
        <button class="btn snack-btn snack-cancel">取消</button>
    </aside>
</article>        
</main>    
`
    }
    constructor(props){
        super(props)
        this.icons={
        "warn":"message-warn.svg",
        "info":"message-info.svg",
        "error":"message-error.svg",
        "success":"message-success.svg"
        }

        window.ioc.autoWired("anDisplay",this);
        window.ioc.autoWired("convert_color",this);
        window.ioc.autoWired("mixin_colors",this);
        window.ioc.autoWired("loadCss",this);
        window.ioc.autoWired("utils",this);
        this.shadow=this.attachShadow({mode:"open"});
        this.shadow.innerHTML=this.render();
        this.loadCss.loadModule("moduleBtn",this.shadow);
        this.imgIcon=this.shadow.querySelector(".img-icon");
        this.mainBg=this.shadow.querySelector(".bg");
        this.article=this.shadow.querySelector("article");
        this.content=this.shadow.querySelector(".content");
        this.btnCancel=this.shadow.querySelector(".snack-cancel");
        this.btnConfirm=this.shadow.querySelector(".snack-primary");
        this.confirmFn=()=>{}
        this.cancelFn=()=>{}
        this.mainBg.addEventListener("click",e=>{
            if(e.selfStop)return;
            this.close();
        })
        this.article.addEventListener("click",e=>{
            e.selfStop=true;
        })
        this.btnConfirm.addEventListener("click",()=>{
            this.confirmFn();
        })
        this.btnCancel.addEventListener("click",()=>{
            this.cancelFn();
        })

        this.an=new this.anDisplay(this.article,"snack-an","snack-transition","flex");
        // setTimeout(()=>{
        //     const div=document.createElement("div");
        //     div.style.position="absolute";
        //     div.style.top="400px";
        //     div.style.left="400px;"
        //     document.body.appendChild(div);
        //     this.open("alert-error","sss",div).then(()=>{// setTimeout(()=>this.an.hide(),500)
        //     })
        // },1000)
    }

    /**
     * @param {"info"|"warn"|"error"|"success"|"alert-error"} type 
     * @param {*} message 
     */
    open(type="info",message,elRelative){
        let alertClass="";
        if(type.startsWith("alert")){
            type=type.split("-")[1];
            alertClass="alert";
            this.imgIcon.style.display="block";
            this.imgIcon.src=`/public/images/${this.icons[type]}`;
        }else{
            this.imgIcon.style.display="none";
            this.imgIcon.src="";
        }

        this.mainBg.style.display="block";
        this.article.className=`snack-type-${type} ${alertClass}`;
        this.utils.defineFixedPosition(this.article,elRelative);
        this.content.innerHTML=message;
        return new Promise((resolve,reject)=>{
            this.an.show(()=>{
                this.confirmFn=()=>{
                    this.confirmFn=()=>{};
                    resolve(true);
                    this.close();
                }
                this.cancelFn=()=>{
                    this.cancelFn=()=>{};
                    resolve(false);
                    this.close();
                }
            });
        })
    }
    close(cb){
        this.cancelFn&&this.cancelFn();
        this.confirmFn=()=>{};
        this.cancelFn=()=>{};
        this.an.hide(()=>{
            this.mainBg.style.display="none";
            cb&&cb();
        });
    }

    
}

