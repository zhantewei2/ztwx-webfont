class Subject{
  /**
   * 
   * ConfigMessage{
   *    author:string;
   *    email:string;
   *    github:string;
   * }
   * 
   * 
   * state{
   *   preFilename:string;
   *   config:ConfigMessage
   * }
   * 
   */
  constructor(){
    this.index=0;
    this.orderer=[];
    this.state={

    }
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
   * @param run (state:State)=>State
   * 
   */
  commit(type,run){
    const state=run(this.state);
    Object.assign(this.state,state);
    
    this.next({
      type
    })
  
  }

  select(filter){
    return filter?filter(this.state):this.state;
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