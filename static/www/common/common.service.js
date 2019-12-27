export class CommonService{
    constructor(){
        this.FONT_LINK_ID="fontCssLink";
        this.FONT_LINK_HREF="/public/nzx.css";
    }
    reloadPage(){
        return new Promise((resolve,reject)=>{
            const log=ioc.getInjection("log");
            log.debug("common service reload begin")
            window.globalStore.next({
                type:"font reloading",
                payload:true
            });

            let link=document.querySelector(`#${this.FONT_LINK_ID}`);
            link&&link.parentElement.removeChild(link);
            link=undefined;
            
            const newLink=document.createElement("link");
            newLink.id=this.FONT_LINK_ID;
            newLink.href=this.FONT_LINK_HREF;
            newLink.setAttribute("rel","stylesheet");
            newLink.setAttribute("type","text/css");
            newLink.addEventListener("load",()=>{
                log.debug("common service reload successful");
                window.globalStore.next({
                    type:"font reloading",
                    payload:null
                })
            })
            newLink.addEventListener("error",()=>{
                window.globalStore.next({
                    type:"font reloading",
                    payload:false
                })
            })
            
            setTimeout(()=>{
                document.body.appendChild(newLink);
            },100)    
        })
        
    }
    getOffsetTop(el,endEl){
        let top=0;
        endEl=endEl||document.body;
        const getOffsetTop=(el)=>{
            if(el==endEl)return;
            top+=el.offsetTop;
            getOffsetTop(el.offsetParent);
        }
        getOffsetTop(el);
        return top;
    }
}