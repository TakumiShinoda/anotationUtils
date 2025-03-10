const { RootPath } = require("../globals")
const { loadDialogHistory } = require("../mods/dialogHistory")

function domLoaded(_){
  return new Promise((res, _) => {
    MainWindow.show()
    res({
      rootPath: RootPath,
      dialogHistories: loadDialogHistory()
    })
  })
}

function exitApp(_){
  process.exit(0)
}

module.exports= {
  domLoaded: domLoaded,
  exitApp: exitApp
}