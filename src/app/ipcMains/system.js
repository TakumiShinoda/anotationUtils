function exitApp(_){
  console.log("exit")
  MainWindow.close()
  process.exit(0)
}

module.exports= {
  exitApp: exitApp
}