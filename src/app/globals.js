const path = require('path')
const { app } = require('electron')

const RootPath = app.isPackaged ? path.dirname(process.execPath) : process.cwd()
const ProgressServerPort = app.isPackaged ? 33800 : 33801

MainWindow = undefined
AnotationProc = undefined
DialogHistory = undefined
ExpressApp = undefined
ExpressServer = undefined

module.exports= {
  RootPath: RootPath,
  ProgressServerPort: ProgressServerPort
}