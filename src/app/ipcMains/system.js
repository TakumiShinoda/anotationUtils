const { BrowserWindow } = require("electron")
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

function maximizeWindow(ev){
  BrowserWindow.fromWebContents(ev.sender).maximize()
}

function minimizeWindow(ev){
  BrowserWindow.fromWebContents(ev.sender).minimize()
}

function closeWindow(ev, withExitApp = false){
  BrowserWindow.fromWebContents(ev.sender).close()

  if(withExitApp) exitApp(undefined)
}

function exitApp(_){
  console.log('exitApp')
  process.exit(0)
}

module.exports= {
  domLoaded: domLoaded,
  maximizeWindow: maximizeWindow,
  minimizeWindow: minimizeWindow,
  closeWindow: closeWindow,
  exitApp: exitApp
}