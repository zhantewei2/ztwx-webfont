class Modal extends HTMLElement{
  constructor(){
    super();
    this.shadow=this.attachShadow({mode:'open'});
    this.wrapper=document.createElement('div');
    this.wrapper.style.display='none';
    this.wrapper.className='wrapper';
    this.wrapper.innerHTML=`
      <main>
        <article></article>
        <footer >close</footer>
      </main>
    `;
    this.shadow.innerHTML=`
      <style>
        .wrapper{
          z-index:100;
          position:fixed;
          top:0;
          bottom:0;
          left:0;
          right:0;
          background:rgba(0,0,0,.2);
          opacity:0;
        }
        main{
          position:absolute;
          width:300px;
          background:white;
          border-radius:10px;
          top:20%;
          left:50%;
          transform:translate(-50%,-80%);
          overflow: hidden;
          box-shadow:0 3px 12px -3px rgba(0,0,0,0.4) ,0 6px 6px -2px rgba(0,0,0,0.1);
          
        }
        @keyframes Entry {
          from {}
          to{transform: translate3d(-50%,-50%,0)}
        }
        @keyframes Leave {
          from{transform:translate3d(-50%,-50%,0)}
          to{transform:translate3d(-50%,-100%,0)}
        }
        @keyframes FadeIn {
          from{}
          to{opacity:1}
        }
        @keyframes FadeOut {
          from{opacity:1}
          to{opacity:0}
        }
        .entry{
          animation:FadeIn .3s ease-out ;
          animation-fill-mode: forwards;
        }
        .leave{
          animation:FadeOut .3s ease-out forwards;
        }
        .entry main{
          animation: Entry .3s ease-out;
          animation-fill-mode: forwards;
        }
        .leave main{
          animation:Leave .3s ease-out;
          animation-fill-mode:forwards;
        }
        article,footer{
          display:flex;
          justify-content: center;
          align-items: center;
          flex-direction:column;
        }
        article{
          min-height:130px;
        }
        footer{
          height:50px;
          position:relative;
        }
        footer:hover{
          background:rgb(230,230,230);
        }
        footer::before{
          content:'';
          display:block;
          height:1px;
          background:gainsboro;
          position:absolute;
          top:0;
          width:100%;
          transform:scaleY(0.33);
        }
      </style>
    `;
    this.shadowRoot.appendChild(this.wrapper);
    const content=this.wrapper.querySelector('article');
    const footer=this.wrapper.querySelector('footer');
    this.main=this.wrapper.querySelector('main');
    this.main.addEventListener('click',e=>e.stopPropagation());
    this.wrapper.addEventListener('click',()=>this.close());
    this.main.addEventListener('animationend',(e)=>{
      if(e.target!==this.main)return;
      if(!this.isShow){
        content.innerHTML='';
        this.wrapper.style.display='none';
        this.wrapper.classList.remove('entry','leave')
      }
    });

    footer.onclick=()=>this.close();
    this.isShow=false;
    this.open=msg=>{
      content.innerHTML=msg;
      this.show();
    };
    this.close=()=>{
      this.hide();
    };

  }
  show(){
    this.wrapper.style.display='block';
    this.isShow=true;
    this.wrapper.classList.add('entry');
  }
  hide(){
    this.isShow=false;
    this.wrapper.classList.add('leave');
  }


}

window.customElements.define('nzx-modal',Modal);
const modal=document.createElement('nzx-modal');


document.body.appendChild(modal);

export {
  modal
}