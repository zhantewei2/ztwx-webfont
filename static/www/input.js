class nzxInput extends HTMLElement{
   constructor(){
      super();
      this.shadow=this.attachShadow({mode:'open'});
      this.shadow.innerHTML=`
      <style>
        input{
          padding:10px;
          border:none;
          min-width:250px;
          font-size:14px;
        }
        input:focus{
          outline:none;
        }
        .input-container{
          display:flex;
          border-radius:var(--radius-btn);
          background:var(--color-lightbg);
          height:45px;
          align-items:center;
          width:150px;
          transition:all .3s ease;
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
        .focus{
          width:300px;
          transform:translateX(10px);
        }
        .focus .input-prefix{
          opacity:1;
          transform:scale(1.1,1.1);
        }
      </style>
      <div class="input-container">
        <span class="input-prefix">
          <slot id="prefix-slot" name="prefix"></slot>
        </span>
        <input clearable placeholder="${this.getAttribute('placeholder')||""}"/>
        
      </div>
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

   }
   connectedCallback(){
    
   }
}
window.customElements.define('nzx-input',nzxInput);

export {
  nzxInput
}