export class MessageComponent extends HTMLElement{
  render(){
    return `
<style>
  .message{
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    border-radius:var(--radius-card);
    padding:25px 50px 25px 20px;
    z-index:200;
    box-shadow:1px 2px 10px -2px rgba(0,0,0,0.2);
    display:none;
    animation:messageEnter .2s ease-in;
  }
  .transition{
    transition:all .3s ease;
  }
  .message-article-an-show-start{
    transform:translate3d(-50%,-100%,0) scale(.8,.8);
    opacity:0;
  }
  .message-article-an-hide-end{
    opacity:0;
    transform:translate3d(-50%,-100%,0) scale(.8,.8);
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
      background:${value};
      color:${fontValue};
    }
  `)}
</style>
<article class="message">
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
    this.shadow=this.attachShadow({mode:"open"});
    this.shadow.innerHTML=this.render();
    this.article=this.shadow.querySelector(".message");
    this.contentEl=this.shadow.querySelector(".content");
    this.closeEl=this.shadow.querySelector(".close");
    this.changeTheme("error")
    this.visible=false;
    this.articleAn=new this.anDisplay(this.article,"message-article-an","transition");
    
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
  }

  show(type,messageHTML){
    if(this.visible)return;
    this.listenerBodyClose();
    this.changeTheme(type);
    this.contentEl.innerHTML=messageHTML;
    this.articleAn.show();
    this.visible=true;
  }
  hide(){
    if(!this.visible)return;
    this.articleAn.hide();
    this.visible=false;
    this.clearEvent();
  }
}