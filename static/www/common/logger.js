export class Logger{
  constructor(logLevel){
    this.levels=["debug","info","warn","error"];

    const indexControl=this.levels.indexOf(logLevel);
    if(indexControl<0)throw "not found logger level";
    this.levels.forEach((i,index)=>{
      if(index<indexControl){
        this[i]=()=>{}
      }else{
        this[i]=this.defineLogger(i);
      }
    });    
    
  }
  defineLogger(levelType){
    switch(levelType){
      case "debug":
        return console.debug.bind(
          console,
          "[debug]",
        );
      case "info":
        return console.info.bind(
            console,
            "[info]"
          );
      case "warn":
        return console.warn.bind(
          console,
          "[warn]",
        );
      case "error":
        return console.error.bind(
          console,
          "[error]",
        )
    }
  }

}