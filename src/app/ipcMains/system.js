const { RootPath } = require("../globals")

function domLoaded(_){
  return new Promise((res, _) => {
    MainWindow.show()
    res(RootPath)
  })
}

function exitApp(_){
  process.exit(0)
}

module.exports= {
  domLoaded: domLoaded,
  exitApp: exitApp
}