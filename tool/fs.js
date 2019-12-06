const path0=require('path');
const fs=require('fs');
const zlib=require('zlib');
Array.prototype.asyncForEach=function(fn,end){
    return this.length?fn(this[0],()=>this.slice(1).asyncForEach(fn,end)):end();
};

const copyFile=(path,targetPath,end)=>{
	fs.lstat(path,(err,stats)=>{
		if(!stats)return end();
		if(stats.isDirectory()){
			fs.mkdir(targetPath,err=>{
				fs.readdir(path,async(err,list)=>{
					try{
						let itemPath,itemTargetPath;
						for(let itemName of list){
							itemPath=path0.join(path,itemName);
							itemTargetPath=path0.join(targetPath,itemName);
							await new Promise((resolve,reject)=>{
								copyFile(itemPath,itemTargetPath,err=>err?reject(err):resolve());
							}) 
						}
					}catch(err){
						end(err);
					}
					end();
				})
			})
		}else{
			fs.copyFile(path,targetPath,err=>end(err));
		}
	})
};
const rmFolder=(path)=>{
	return new Promise((resolve,reject)=>{
		fs.lstat(path,(err,stats)=>{
			if(!stats)return resolve();
			if(stats.isDirectory()){
				fs.readdir(path,async(err,list)=>{
					try{
						let itemPath;
						for(let itemName of list){
							itemPath=path0.join(path,itemName);
							await rmFolder(itemPath);
						}
						fs.rmdir(path,err=>err?reject(err):resolve())
					}catch(err){
						reject(err);
					}
				})
			}else{
				fs.unlink(path,err=>err?reject(err):resolve())
			}
		})
	})
}
const createFs=(filePath,outPath,cb)=>{
        ws=fs.createWriteStream(outPath);
        rs=fs.createReadStream(filePath);
        gzip=zlib.createGzip();
        ws.on('close',cb);
        rs.pipe(gzip).pipe(ws);
};
const gzipFolder=(...args)=>{
	const max=args.length-1;
	const cb=args[max];
	const _args=args.slice(0,max);
	const [inputPath,outPath,includes]=_args;

    fs.stat(inputPath,(err,result)=>{
    	if(!result)return cb();
        if(result.isDirectory()){
            fs.readdir(inputPath,(err,list)=>{
                fs.mkdir(outPath,(err)=>{
                    list.asyncForEach(
                        (val,next)=>gzipFolder(path0.join(inputPath,val),path0.join(outPath,val),includes,next),cb
                    )
                })
            })
        }else{
        	if(includes){
        		const last=inputPath.lastIndexOf('.');
        		if(last){
        			const extend=inputPath.slice(last+1)
        			if(includes.indexOf(extend)!=-1)return createFs(inputPath,outPath,cb);
        		}
        		copyFile(inputPath,outPath,cb);
        	}else{
    		    createFs(inputPath,outPath,cb);
        	}
        }
    })
}



exports.copyFile=copyFile;
exports.rmFolder=rmFolder;
exports.gzipFolder=gzipFolder;
