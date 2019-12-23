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
    position:fixed;
    bottom:1rem;
    height:var(--article-h);
    left:50%;
    display:none;
    transform:translate3d(-50%,0,0);
    opacity:1;
    line-height:var(--article-h);
    border:1px solid var(--color-softbg);
    background:var(--color-bg);
    transform-origin:0% 100%;
    transition: all .2s ease;
}
@keyframes An-btn{
    0%{}

    50%{transform:translate3d(0,15%,0)}
    100%{transform:translate3d(0,0,0)}
}
article:hover{
    transform:scale3d(1.4,1.4,1) translateX(-50%);
    border-color:transparent;
}

.content{
    min-width:120px;
    font-size:13px;
    color: var(--icon-color);
    padding:0 1rem;
}
 .snack-an-show-start{
    opacity:0;
    transform:translate3d(-50%,50%,0);
}
 .snack-an-hide-end{
    transform:translate3d(-50%,50%,0);
    opacity:0;
 }
 .snack-transition{
     transition:all .3s ease;
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
 
 article:hover .snack-primary{
    animation:An-btn .2s ease-out;
 }
 article:hover .snack-cancel{
    animation:An-btn .2s ease-out;
 }

 ${this.mixin_colors((color,value,fontValue)=>`
    .snack-type-${color}{
        box-shadow: 1px 12px 24px -14px ${this.convert_color.opacity(value,0.2)},1px 6px 16px -8px rgba(0,0,0,.2);
    }
 `)}

</style>
<article>
    <label class="content">

    </label>
    <aside>
        <button class="btn snack-btn snack-primary">确认</button>
        <button class="btn snack-btn snack-cancel">取消</button>
    </aside>
</article>        
        `
    }
    constructor(props){
        super(props)
        window.ioc.autoWired("anDisplay",this);
        window.ioc.autoWired("convert_color",this);
        window.ioc.autoWired("mixin_colors",this);
        window.ioc.autoWired("loadCss",this);
        this.shadow=this.attachShadow({mode:"open"});
        this.shadow.innerHTML=this.render();
        this.loadCss.loadModule("moduleBtn",this.shadow);

        this.article=this.shadow.querySelector("article");
        this.content=this.shadow.querySelector(".content");

        this.an=new this.anDisplay(this.article,"snack-an","snack-transition","flex");
        setTimeout(()=>{
            this.open("info","sss").then(()=>{
                // setTimeout(()=>this.an.hide(),500)
            })
        },1000)
    }

    /**
     * @param {*} type 
     * @param {*} message 
     */
    open(type="info",message){

        this.article.className=`snack-type-${type}`;
        this.content.innerHTML=message;
        return new Promise((resolve,reject)=>{
            this.an.show(resolve);
        })
    }

    
}

