let hoge = false

function domLoaded(_){
  MainWindow.show()
}

function exitApp(_){
  console.log("exit")
  MainWindow.close()
  process.exit(0)
}

module.exports= {
  domLoaded: domLoaded,
  exitApp: exitApp
}