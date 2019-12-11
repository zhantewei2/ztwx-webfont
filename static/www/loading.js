
class LoadingComponent extends HTMLElement{
    constructor(){
        super();
        const wrapper=document.createElement("span");
        wrapper.innerHTML=`
        <i class="nzx-loading na na-loading an-rotate"></i>
        `
        const an=new window.NzxAnimation(wrapper,"an-fade-transition");
        this.show=()=>{
            this.appendChild(wrapper);
        }
        this.close=()=>{
            an.leave("an-fade-leave");
        }
        
    }
}

window.customElements.define("nzx-loading",LoadingComponent);