function exitApp(_){
  console.log("exit")
  mainWindow.close();
}

module.exports= {
  exitApp: exitApp
}