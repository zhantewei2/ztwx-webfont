const client=new WebSocket("ws://localhost:6601");

client.addEventListener("open",e=>{
    console.log("open");
   client.send("hello");
});
client.addEventListener("message",e=>{
    console.log(e.data);
});
