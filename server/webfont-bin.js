#!/usr/bin/env node
const path=require("path");
const {spawn}=require("child_process");
const switchPort=require("./switchPort");
const openBrowser=require("open");
const program =require("commander");
const {handleConf} =require("./lib/handle-conf");
const fs=require("fs");
const CONF=handleConf.getConfig();
const {version,config_filename}=CONF;

const parseResult=program
  .version(CONF["version"])
  .command("start")
  .option("-f,--config <string>", "specify configuration file")
  .action(({config:configFilename})=>{
    if(configFilename){
      configFilename=path.join(process.cwd(),configFilename);
      const configFileExists=fs.existsSync(configFilename);
      if(!configFileExists){
        console.log("\033[31m Not Found config file: \033[0m :"+configFilename);  
        return;
      }
    }else{
      configFilename=path.join(process.cwd(),config_filename);
      const configFileExists=fs.existsSync(configFilename);
      if (!configFileExists){
        handleConf.createFollowerConfigFile(configFilename);
        console.log("\033[36m New configFile created by default configuration \033[0m")
      }
    }
    console.log(CONF["server_port"])
    switchPort(
      Number(CONF["server_port"]),
      20,
      (port)=>{
        const ps=spawn("node",[
          path.join(__dirname,"app.js"),
          port,
          configFilename
        ],{stdio:["inherit","inherit","inherit"],detached:false});
      }
    )

  })


program.parse(process.argv);
