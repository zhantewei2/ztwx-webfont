export const queryStringify=obj=>{
  if(!obj)return '';
  let str='';
  for(let i in obj){
    str+=i+'='+obj[i]+'&'
  }
  return str.slice(0,-1);
}

class Ajax{
  constructor(){

  }
  send(method,address,params,headers={}){
    const xhr=new XMLHttpRequest();
    let sendQuery="";

    method=method.toUpperCase();
    if(method=="GET"&& params)address=address+"?"+queryStringify(params);
    
    return new Promise(((resolve,reject)=>{
      xhr.onreadystatechange=()=>{
        if(xhr.readyState==4){
          if(xhr.status==0)return reject("lose")
          resolve({
            status:xhr.status,
            content:xhr.responseText
          })
        }
      };

      if(method!=="GET"){
        headers={
          "Content-Type":"application/json",
          ...headers
        };
        sendQuery=JSON.stringify(params);
      }

      xhr.open(method,address);
      for(let i in headers){
        xhr.setRequestHeader(i,headers[i])
      }
      xhr.send(sendQuery);
    }))
  }

  up(address,params,buffer){
    const xhr=new XMLHttpRequest();
    return new Promise((resolve,reject)=>{
      xhr.onreadystatechange=()=>{
        if(xhr.readyState==4){
          if(xhr.status==0)require("lose");
          resolve({
            status:xhr.status,
            content:xhr.responseText
          })
        }
      }
      xhr.onreadystatechange("Content-Type","application/octet-stream");
      xhr.open("post",address+"?"+queryStringify(params));
      xhr.send(buffer)
    })

  }
}

export const ajax=new Ajax;
