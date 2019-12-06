class PropCard extends HTMLElement{
  constructor(){
    super();
    this.shadow=this.attachShadow({mode:"open"});
    this.shadow.innerHTML=`
    <style>
      @import "/public/main.css";
    </style>
    <div class="nzx-propCard">
      <main class="_content">
        <slot name="content"></slot>
      </main>
    </div>
    `;
    const content=this.shadow.querySelector(".nzx-propCard ._content");
    const wrapper=this.shadow.querySelector(".nzx-propCard");
    content.addEventListener("click",e=>{
      e.stopPropagation();
    })
    wrapper.addEventListener("click",e=>{
      this.parentElement.removeChild(this)
    })
  }
}



class UploadPlate extends HTMLElement{
  constructor(){
    super();
    this.shadow=this.attachShadow({mode:"open"});
    this.shadow.innerHTML=`
    <style>
      @import "/public/main.css";
    </style>
    <article class="nzx-upload-content">
      upload-content
    </article>
    `
  }
  connectedCallback(){
    
  }

}



class nzxUpload extends HTMLElement{
  constructor(){
    super();
    this.shadow=this.attachShadow({mode:"open"});

    this.shadow.innerHTML=`
     <style>
      @import "/public/main.css"
     </style>
    <button class="nzx-btn">upload</button>
    `;
  }
  connectedCallback(){
    const uploadBtn=this.shadow.querySelector(".nzx-btn");


    uploadBtn.addEventListener("click",()=>{
      console.debug("shadow upload prop");
      const prop=document.createElement("nzx-propcard");
      prop.innerHTML=`
        <nzx-uploadplate slot="content">content</nzx-uploadplate>
      `
      document.body.appendChild(prop);

    })
 
  }


}

window.customElements.define("nzx-propcard",PropCard);
window.customElements.define("nzx-upload",nzxUpload);
window.customElements.define("nzx-uploadplate",UploadPlate);

export {
  nzxUpload
}
