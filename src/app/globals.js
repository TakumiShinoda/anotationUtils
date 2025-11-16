const path = require('path')
const { app } = require('electron')

const RootPath = app.isPackaged ? path.dirname(process.execPath) : process.cwd()
const ProgressServerPort = 33800

MainWindow = undefined
AnotationProc = undefined
DialogHistory = undefined
ExpressApp = undefined
ExpressServer = undefined

module.exports= {
  RootPath: RootPath,
  ProgressServerPort: ProgressServerPort
}