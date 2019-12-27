export class mainFooter extends HTMLElement{
  render(){
    return `
<style>
    footer{
      background:var(--color-primarybglinear);
      color:white;
      padding:30px 20px;
    }
    .footer-content{
      max-width:900px;
      margin:0 auto;
      display:flex;
    }
    a[href]{
      text-decoration:none;
      color:var(--color-primary);
      transition:all .3s ease;
    }
    a[href]:hover{
      color: var(--color-type-info);
    }
</style>
<footer>
    <div class="footer-content">
      <div>
        <article class="list-group">
          ${this.renderList(this.messageList)}
        </article>
      </div>
      <div>
      </div>
    </div>
</footer>
    `
  }
  renderList(messageList){
    return messageList.map(i=>`
    <div class="${i.type=="linear"?"list-item list-linear":"empty-list list-linear"}">
      <label>${i.label}</label>
      <aside>
        ${i.content.startsWith("http")?
          `<a href="${i.content}" target="_blank">${i.content}</a>`:i.content
      }
      </aside>
    </div>
          `).join("");
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
    //需要展示的配置项：
    /**
     * 位于 sbin/setting.conf中指定的配置
     */
    this.listKeys=["author","email","github","version"];

    this.shadow.innerHTML=this.render();
    this.loadCss.loadModule("moduleList",this.shadow);
    const listGroup=this.shadow.querySelector("article.list-group");
    this.globalStoreOrder=window.globalStore.subscribe(({type,payload})=>{
      if(type=="load config end"){
        const configMsgDict=window.globalStore.select(state=>state.config);
        listGroup.innerHTML=this.renderList(
          this.listKeys.map(key=>({label:key.slice(0,1).toUpperCase()+key.slice(1),content:configMsgDict[key]}))
        );

      }
    })
  }
  connectedCallback(){
  }
}
window.customElements.define('ztwx-footer',mainFooter);