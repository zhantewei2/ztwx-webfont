class nzxInput extends HTMLElement{
   constructor(){
      super();
      this.shadow=this.attachShadow({mode:'open'});
      this.shadow.innerHTML=`
      <style>
        input{
          border:1px solid gainsboro;
          padding:10px;
          border-radius:5px;
          min-width:250px;
          font-size:14px;
        }
        input:focus{
          outline:none;
        }
      </style>
      <input clearable placeholder="${this.getAttribute('placeholder')}"/>
      `;
      
      const input=this.shadowRoot.querySelector('input');
      const throttleTime=(time,cb)=>{
        let t;
        return (e)=>{
          if(t)return;
          t=setTimeout(()=>{
            t=null;
            cb(e);
          },time)
        }
      };
      this.execute=value=>{};
      this.onInput=cb=>this.execute=cb;
      input.addEventListener('input',throttleTime(300,e=>this.execute(input.value)));
   }
}
window.customElements.define('nzx-input',nzxInput);

export {
  nzxInput
}