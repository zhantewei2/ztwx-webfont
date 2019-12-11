export class CommonService{
    constructor(){
        this.FONT_LINK_ID="fontCssLink";
        this.FONT_LINK_HREF="/public/nzx.css";
    }
    reloadPage(){
        let link=document.querySelector(`#${this.FONT_LINK_ID}`);
        link.parentElement.removeChild(link);
        link=undefined;
        
        const newLink=document.createElement("link");
        newLink.id=this.FONT_LINK_ID;
        newLink.href=this.FONT_LINK_HREF;
        newLink.setAttribute("rel","stylesheet");
        newLink.setAttribute("type","text/css");
        newLink.addEventListener("load",()=>{
            window.globalStore.next({
                type:"reload page",
                payload:true
            })
        })
        
        setTimeout(()=>{
            document.body.appendChild(newLink);
        },100)
    }
}