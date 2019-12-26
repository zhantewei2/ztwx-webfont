class nzxInput extends HTMLElement{
   constructor(){
      super();
      ioc.autoWired("utils",this);
      this.shadow=this.attachShadow({mode:'open'});
      this.shadow.innerHTML=`
      <style>
        input{
          padding:10px;
          border:none;
          min-width:250px;
          font-size:14px;
          box-sizing:border-box;
        }
        input:focus{
          outline:none;
        }
        .input-container{
          display:flex;
          box-sizing:border-box;
          border-radius:var(--radius-btn);
          background:var(--input-bg);
          height:45px;
          align-items:center;
          width:150px;
          transition:all .3s ease;
          border:1px solid transparent;
        }
        input{
          padding:0 1rem;
          font-size:13px;
          color:var(--color-font);
          flex:1;
          background:transparent;
          height:100%;
        }
        .input-prefix{
          display:none;
          justify-content:center;
          align-items:center;
          min-width:40px;
          opacity:.5;
          transition:all .3s ease;
        }
        .__prefix input{
          padding-left:0;
        }
        .__suffix input{
          padding-right:0;
        }
        .focus:not(.disableStretch){
          width:300px;
          transform:translateX(10px);
        }
        .focus:not(.disableStretch) .input-prefix{
          opacity:1;
          transform:scale(1.1,1.1);
        }
        .focus.disableStretch{
          border:3px solid var(--color-primary-light2);
        }
        .disableStretch{
          width:100%;
        }
        .__input-center input{
          text-align:center;
        }
      </style>
      <div class="input-container">
        <span class="input-prefix">
          <slot id="prefix-slot" name="prefix"></slot>
        </span>
        <input clearable placeholder="${this.getAttribute('placeholder')||""}"/>
        
      </div>
      `;
      
      const input=this.inputNode=this.shadowRoot.querySelector('input');
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

      this.container=this.shadow.querySelector(".input-container");
      input.addEventListener('input',throttleTime(300,e=>this.execute(input.value)));

      this.prefixSlot=this.shadow.querySelector("#prefix-slot");
      this.prefixWrapper=this.shadow.querySelector(".input-prefix");
      this.prefixSlot.addEventListener("slotchange",()=>{
        const nodes=this.prefixSlot.assignedNodes();
        if(nodes&&nodes.length){
          this.prefixWrapper.style.display="inline-flex";
          this.container.classList.add("__prefix");
        }else{
          this.prefixWrapper.style.display="none";
          this.container.classList.remove("__prefix");
        }
      })

      input.addEventListener("focus",()=>{
        this.container.classList.add("focus");
      })
      input.addEventListener("blur",()=>{
        this.container.classList.remove("focus");
      })

      input.addEventListener("input",(e)=>{
        this.valueChangeCb&&this.valueChangeCb(e.target.value);
      })
      input.addEventListener("keypress",this.utils.debounceTime(
        e=>{
          if(e.key.toLowerCase()=="enter")this.enterCb&&this.enterCb();
        },
        200
      ))
   }
   connectedCallback(){
    const disableStretch=this.getAttribute("disable-stretch")
    if(disableStretch){
      this.container.classList.add("disableStretch");
    }
    if(this.getAttribute("input-center")){
      this.container.classList.add("__input-center")
    }
   }
   blur(){
       this.inputNode.blur();
   }
   focus(){
     this.inputNode.focus();
   }
   set value(v){
     this.inputNode.value=this._value=v;
   }
   get value(){
     return this._value=this.inputNode.value;
   }

   valueChange(cb){
    this.valueChangeCb=cb;
   }
   onEnter(cb){
    this.enterCb=cb;
   }
   select(){
     this.inputNode.select();
   }
}
window.customElements.define('nzx-input',nzxInput);

export {
  nzxInput
}