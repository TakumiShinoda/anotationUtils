function domLoaded(_){
  MainWindow.show()
}

function exitApp(_){
  process.exit(0)
}

module.exports= {
  domLoaded: domLoaded,
  exitApp: exitApp
}