


export class NzxAnimation{
    constructor(element,transitionClass){
        this.leaving=false;
        this.el=element;
        this.transitionClass=transitionClass;
    }

    leave(className,handleElement,cb){
        if(this.leaving)return;
        this.leaving=true;
        const transitionEvent=(e)=>{
            if(e.target!==this.el)return;
            this.leaving=false;
            this.el.removeEventListener("transitionend",transitionEvent);
            const currentElement=handleElement||this.el;
            this.el.classList.remove(className);
            currentElement.parentElement.removeChild(currentElement);
            cb&&cb();
        }
        this.el.addEventListener("transitionend",transitionEvent);
        this.el.classList.add(this.transitionClass,className);
    }
}

export class NzxDisplayAn{
    constructor(element,animationCssName,transitionClass,displayName="block"){
        this.transition=transitionClass;
        this.el=element;
        this.show_start=animationCssName+"-show-start";
        this.hide_end=animationCssName+"-hide-end";

        this.displayName=displayName;
    
        this.an_show_running=false;
        this.an_hide_running=false;
        this.hideCallback=null;
        this.showCallback=null;

        this.el.addEventListener("transitionend",(e)=>{
           
            if(e.target!==this.el||!(this.an_hide_running||this.an_show_running))return;
            if(this.an_hide_running){
                this.el.style.display="none";
                if(this.hideCallback)this.hideCallback();
            }else if(this.an_show_running){
                if(this.showCallback)this.showCallback();
            }

            this.clearBefore();
        })
        
    }
    clearBefore(){
        this.an_show_running=this.an_hide_running=false;
        this.el.classList.remove(this.show_start,this.hide_end,this.transition);
    }
    show(cb=null){
        this.clearBefore();
        this.el.classList.add(this.show_start,this.transition);
        this.el.style.display=this.displayName;
        this.an_show_running=true;
        setTimeout(()=>{
            this.el.classList.remove(this.show_start);
        },10);
        this.showCallback=cb;
    }
    hide(cb=null){
        this.clearBefore();
        this.el.classList.add(this.hide_end,this.transition);
        this.an_hide_running=true;
        this.hideCallback=cb;
    }
}



export class LoadCss{
    constructor(){
        this.modules={};
        this.loaded=false;
        this.loadFn=()=>{}
    }
    load(cssLink){
        window.nzxAjax.send("get",cssLink).then(
            result=>{
                if(result.status!==200){
                    console.error("load css failure~");
                    return;
                }
                this.assembleModule(result.content)
            }
        )
    }
    loadModule(name,shadowEl){
        const writeStyle=()=>{
            const styleEl=document.createElement("style");
            styleEl.innerHTML=this.modules[name];
           
            shadowEl.appendChild(styleEl)  
        }   

        if(this.loaded)return writeStyle();
        const oldFn=this.loadFn;
        this.loadFn=()=>{
            oldFn.call(this);
            writeStyle();
        }
    }
    assembleModule(content){
        let now,pre;
        let next_ignore=0;
        let process_ignore=false;
        let process_module=false;
        let process_module_name=false;
        let process_module_content=false;
        let process_module_contentMake=0;
        let modules={};
        let module_name="";
        let module_content="";
        for(let i=0,len=content.length;i<len;i++){
            //start
            now=content[i];
            
            if(next_ignore>0){
                next_ignore--;
                continue;
            }else if(now=="\n"){
                continue;
            }
            else if(now=="/"&&content[i+1]=="*"){
                process_ignore=true;
                next_ignore++;
            }else if(now=="*"&&content[i+1]=="/"){
                process_ignore=false;
                next_ignore++;
            }else if(process_ignore){
                continue;
            }else if(process_module_name){
                if(now=="{"){
                    process_module_name=false;
                    process_module_content=true;
                    process_module_contentMake=0;
                }else{
                    module_name+=now;
                }
            }else if(process_module_content){
                if(now=="}"&&process_module_contentMake==0){
                    process_module_content=false;
                    modules[module_name]=module_content;
                }else{
                    module_content+=now;
                    if(now=="{"){
                        process_module_contentMake+=1;
                       
                    }else if(now=="}"){
                        process_module_contentMake-=1;
                    }
                }
            }else if(now=="."){
                process_module=process_module_name=true;
                module_name="";
            }
            
            //end
            pre=now;
        }
        Object.assign(this.modules,modules);
        this.loaded=true;
        this.loadFn();
    }

} 

export const mixin_buildVariousColor=(render)=>{
   const colors=window.ioc.getInjection("typeColors");
   let value;
   let fontValue;
   return colors.map(color=>{
    value=`var(--color-type-${color})`;
    fontValue=`var(--color-type-${color}-font)`
    return render(color,value,fontValue)
   }).join("");
}


export class ConvertColor{
    constructor(){
        this.styles=getComputedStyle(document.body);
        
    }
    getColorValue(name){

        const valueName=name.match(/var\((.+)\)/)[1];
        let v=this.styles.getPropertyValue(valueName);

        if(v.indexOf("#")==0)return this.getRGBFromHex(v.slice(1))
    }
    getRGBFromHex(value){
        let p;
        let rgb=[];
        for(let i =0;i<3;i++){
            p=value.slice(i*2,i*2+2);
            rgb.push(parseInt(p,16))
        }
        return rgb;
    }
    opacity(color,percent){
        const rgb=this.getColorValue(color);
        return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${percent})`;
    }
}
