export class mainFooter extends HTMLElement{
  render(){
    console.log()
    return `
<style>
    footer{
      background:var(--color-primarybglinear);
      color:white;
      margin-top:50px;
      padding:30px 20px;
    }
    .footer-content{
      max-width:900px;
      margin:0 auto;
      display:flex;
    }
</style>
<footer>
    <div class="footer-content">
      <div>
        <article class="list-group">
          ${
            this.messageList.map(i=>`
      <div class="${i.type=="linear"?"list-item list-linear":"empty-list list-linear"}">
        <label>${i.label}</label>
        <aside>${i.content}</aside>
      </div>
            `).join("")
          }
        </article>
      </div>
      <div>
      </div>
    </div>
</footer>
    `
  }
  constructor(){
    super();
    ioc.autoWired("loadCss",this);
    this.shadow=this.attachShadow({mode:'open'});
    this.messageList=[
      {label:"Author",content:"zhantewei"},
      {label:"Email",content:"zhantewei@gmail.com"},
      {label:"Github",content:"xxx"}
    ]

    this.shadow.innerHTML=this.render();
    this.loadCss.loadModule("moduleList",this.shadow);

   
  }
  connectedCallback(){
  }
}
window.customElements.define('ztwx-footer',mainFooter);