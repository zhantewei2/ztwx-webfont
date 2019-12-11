class Subject{
  constructor(){
    this.index=0;
    this.orderer=[];

  }
  /** 
  * @param PayParam{
  *   type: type
  *   payload: message
  * }
  * @Auth zhantewei
  * @Date 2019-12-11 10h
  **/
  next(params){
    for(let order of this.orderer){
      order.run(params);
    }
  }
  /** 
  * @param runcallBack (p:PayParam)=>void
  * @Auth zhantewei
  * @Date 2019-12-11 10h
  **/
  subscribe(runCallback){
    const ref={
      index:this.index++,
      run:runCallback
    }
    this.orderer.push(ref);
    
    return {
      unsubscribe:()=>{
        const indexPos=this.orderer.findIndex(i=>i.index==ref.index);
        if(indexPos<0)return;
        this.orderer.splice(indexPos,1);
      }
    }
  }
}


window.globalStore=new Subject();