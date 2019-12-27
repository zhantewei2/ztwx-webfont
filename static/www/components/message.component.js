export class MessageComponent extends HTMLElement{
  render(){
    return `
<style>
  .message{
    position:fixed;
    top:80px;
    right:10px;;
    border-radius:var(--radius-card);
    padding:25px 50px 25px 20px;
    z-index:200;
    background: var(--color-bg);
    display:none;
    min-width:180px;
    max-width:250px;
    animation:messageEnter .2s ease-in;
    font-family:var(--font-base);
    align-items:center;
  }
  .message-icon{
    width:35px;
    height:35px;
    margin-right:1rem;
  }
  .transition{
    transition:all .3s ease;
  }
  .message-article-an-show-start{
    transform:translate3d(100%,0%,0) ;
    opacity:0;
  }
  .message-article-an-hide-end{
    opacity:0;
    transform:translate3d(100%,0%,0);
  }
  .close{
    position:absolute;
    top:10px;
    right:10px;
  }
  .close img{
    height:20px;
    width:20px;

  }
  ${this.mixin_colors((key,value,fontValue)=>`
    .message-${key}{
      background:linear-gradient(45deg,${value},${fontValue});
      box-shadow:1px 8px 23px -10px ${this.convert_color.opacity(value,0.8)}, 1px 3px 8px -2px ${this.convert_color.opacity(fontValue,.2)};
      color:white;
    }
  `)}
</style>
<article class="message">
 
    <img class="message-icon">

    <main class="content">
      content
    </main>
    <span class="close">
      <img src="/public/images/close.svg" />
    </span>
</article>
    `
  }
  
  constructor(props){
    super(props);
    window.ioc.autoWired("mixin_colors",this);
    window.ioc.autoWired("anDisplay",this);
    window.ioc.autoWired("convert_color",this);
    this.iconBaseUrl="/public/images/";
    this.icons={
      "warn":"message-warn.svg",
      "info":"message-info.svg",
      "error":"message-error.svg",
      "success":"message-success.svg"
    }


    this.shadow=this.attachShadow({mode:"open"});
    this.shadow.innerHTML=this.render();
    this.article=this.shadow.querySelector(".message");
    this.contentEl=this.shadow.querySelector(".content");
    this.closeEl=this.shadow.querySelector(".close");
    this.iconEl=this.shadow.querySelector(".message-icon");
    this.changeTheme("error")
    this.visible=false;
    this.articleAn=new this.anDisplay(this.article,"message-article-an","transition","flex");
    class CloseTimeout{
      constructor(time){
        this.timefn=undefined;
        this.time=time;  
      }
      clear(){
        if(this.timefn){
          clearTimeout(this.timefn);
          this.timefn=undefined;
        }
      }
      coundDown(run){
        this.clear();
        this.timefn=setTimeout(()=>run(),this.time);
      }
    }

    this.closeTimeout=new CloseTimeout(1500);

    this.shouldRemoveClose=false;

    this.clearEvent=()=>{
      if(this.shouldRemoveClose){
        document.body.removeEventListener("click",this.bodyCloseEvent);
      }
      this.shouldRemoveClose=false;
    }

    this.bodyCloseEvent=(e)=>{
      const node=e.target;
      if(node==this||this.contains(node))return;
      this.clearEvent();
      this.hide();
    }

    this.closeEl.onclick=()=>{
      this.hide();
    }
  }
  listenerBodyClose(){
    this.shouldRemoveClose=true;
    setTimeout(()=>{
      document.body.addEventListener("click",this.bodyCloseEvent);
    },100);
  }

  changeTheme(themeType){
    const nowClass=`message-${themeType}`;
    const currentClass=this.article.className;
    const classReg=/message-\w+/;
    if(currentClass.match(classReg)){
      this.article.className=currentClass.replace(classReg,nowClass)
    }else{
      this.article.classList.add(nowClass);
    }
    /**
     * icon
     */
    this.iconEl.src=this.iconBaseUrl+this.icons[themeType];
  }

  show(type,messageHTML){
    if(this.visible)return;
    this.listenerBodyClose();
    this.changeTheme(type);
    this.contentEl.innerHTML=messageHTML;
    this.articleAn.show();
    this.visible=true;
    this.closeTimeout.coundDown(()=>this.hide());
  }
  hide(){
    if(!this.visible)return;
    this.closeTimeout.clear();
    this.articleAn.hide();
    this.visible=false;
    this.clearEvent();
  }
}