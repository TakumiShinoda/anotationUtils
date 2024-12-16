function exitApp(_){
  console.log("exit")
  mainWindow.close()
  process.exit(0)
}

module.exports= {
  exitApp: exitApp
}