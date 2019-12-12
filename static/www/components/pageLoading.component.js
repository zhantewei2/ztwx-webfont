export class PageLoading extends HTMLElement{
  render(){
    return `
<style>
    .pageLoading{
      position:fixed;
      top:0;
      left:0;
      right:0;
      bottom:0;
      z-index:10000;
      background:rgba(255,255,255,0.1);
      display:none;
    }
    .pageLoading-block{
      position:absolute;
      left:50%;
      top:50%;
      transform:translate3d(-50%,-50%,0);
      border-radius:50%;
      background:rgba(255,255,255,.8);
      padding:10px;
      transition:all .3s ease;
    }
    img{
      height:100px;
      width:100px;
    }
    .pageLoading-an-show-start{
      opacity:0;
    }
    .pageLoading-an-show-start .pageLoading-block{
      transform:translate3d(-50%,-50%,0) scale(.8,.8);
    }

    .pageLoading-an-hide-end{
      opacity:0;
    }
    .pageLoading-an-hide-end .pageLoading-block{
      transform:translate3d(-50%,-50%,0) scale(.8,.8);
    }

    .transition{
      transition:all .3s ease;
    }
</style>
<div class="pageLoading">
  <main class="pageLoading-block">
    <img src="/public/images/page-loading.svg"/>
  </main>
</div>
    `
  }
  constructor(props){
    super(props);
    window.ioc.autoWired("mixin_colors",this);
    window.ioc.autoWired("anDisplay",this);
    this.shadow=this.attachShadow({mode:"open"});
    this.shadow.innerHTML=this.render();
    this.pageWrapperEl=this.shadow.querySelector(".pageLoading");
    this.pageWrapperAn=new this.anDisplay(this.pageWrapperEl,"pageLoading-an","transition");
    this.isShow=false;
  }
  show(){
    if(this.isShow)return;
    this.pageWrapperAn.show();
  }
  hide(){
    this.pageWrapperAn.hide();
  }
}