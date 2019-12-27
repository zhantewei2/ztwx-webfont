export class AlertComponent extends HTMLElement{
  render(){
    return `
  <style>
    .alert{
      border-radius:var(--radius-card);
      padding-left:12px;
      display:none;
      min-width:150px;
      text-align:center;
      font-size:13px;
      height:60px;
      align-items:center;
    }
    ${this.mixin_colors((key,value,fontValue)=>`
      .alert-${key}{
        background:${this.convertColor(value)};
        color:${fontValue};
      }
    
    `)}
    .alert-an-show-start{
      transform:scale3d(.8,.8,.8);
      opacity:0;
    }
    .alert-an-hide-end{
      opacity:0;
      transform:translate3d(0,-50%,0);
    }
    .transition{
      transition:all .3s ease;
    }
    .alert-content{
      flex:1;
    }
    .alert-close{
      width:50px;
    }
    .alert-close img{
      width:25px;
      height:25px;
    }
  </style>
<div class="alert">
    <div class="alert-content"></div>
    <div class="alert-close">
      <img src="/public/images/close.svg" />
    </div>
</div>
    `
  }
  convertColor(color){
    return this.convert_color.opacity(color,0.5);
  }
  constructor(props){
    super(props);
    ioc.autoWired("convert_color",this);
    ioc.autoWired("log",this);
    ioc.autoWired("anDisplay",this);
    ioc.autoWired("mixin_colors",this);
    this.shadow=this.attachShadow({mode:"open"});
    this.shadow.innerHTML=this.render();
    this.alert=this.shadow.querySelector(".alert");
    this.alertAn=new this.anDisplay(this.alert,"alert-an","transition","inline-flex");
    this.alertContent=this.shadow.querySelector(".alert-content");
    this.closeBtn=this.shadow.querySelector(".alert-close");

    this.closeBtn.onclick=()=>{
      this.hide();
    }
    this.isShow=false;
  }
  changeTheme(themeType){
    const nowClass=`alert-${themeType}`;
    const currentClass=this.alert.className;
    const classReg=/alert-\w+/;
    if(currentClass.match(classReg)){
      this.alert.className=currentClass.replace(classReg,nowClass)
    }else{
      this.alert.classList.add(nowClass);
    }
  }
  show(type,message){
    this.changeTheme(type);
    this.alertContent.innerHTML=message;
    if(this.isShow)return;
    this.alertAn.show();
    this.isShow=true;
  }
  hide(){
    if(!this.isShow)return;
    this.alertAn.hide();
    this.isShow=false;
  }
}