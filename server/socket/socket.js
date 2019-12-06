const WS=require("ws");
const {Subject}=require("rxjs");

class SocketDataCoding{
    handleName="-data:";
    constructor(type) {
        this.key=`${type}this.handleName`;
    }
    enableData(result){
        return result.startsWith(this.key);
    }
    getData(result){
        return result.slice(this.key.length)
    }
    setData(content){
        return this.key+content;
    }
}

class SocketClient{
    constructor(ws){
        this.ws=ws;
        this._whenSub=new Subject();
        ws.on("connection",socket=>
            ws.on("message",msg=>this._whenSub.next(msg))
        );

    }
    //callback: (msg,next)=>void
    on(type,callback){
        const coding=new SocketDataCoding(type);
        return this._whenSub.subscribe(
            msg=>{
                if(coding.enableData(msg))callback(msg,)
            },
            err=>console.error(err)

        );
    }
    send(type,msg,callback){

    }
}

const ws= new WS.Server({
    port:6601
});
let _send;
let _when;
let _queueSend=[];
let _queueWhen=[];

ws.on("connection",(socket)=>{
    const _when_task=[];
    _when=(type,content)=>{}
    socket.on("message",(message)=>{

    })

});

const send=(type,content)=>{

};
const when=(type,callback)=>{

};