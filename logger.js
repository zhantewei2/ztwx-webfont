const {MainLogger,defaultConsoleTransport}=require("./loggerFactory");


const mainLogger=new MainLogger();
mainLogger.config({
  level:"debug"
})
mainLogger.addTransport(defaultConsoleTransport);


module.exports.LoggerFactory=mainLogger;