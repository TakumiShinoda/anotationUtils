const { app, BrowserWindow, ipcMain } = require('electron')

const { distPath } = require('../../dev/path')
const { getImageViewList } = require('./ipcMains/ImageViewer')
const { copyFile, openFileDialog, openFolderDialog } = require('./ipcMains/dialogs')
const { exitApp, domLoaded } = require('./ipcMains/system')
const { loadAnotationTarget } = require('./ipcMains/autoAnotation')
const { getDatabaseInfo } = require('./ipcMains/anotatedImage')
const { loadDialogHistory } = require('./mods/dialogHistory')

require('electron-reload')(['./dist/bundles/**'])

app.on('ready', () => {
  DialogHistory = loadDialogHistory()
  MainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 960,
    minHeight: 720,
    resizable: true,
    movable: true,
    'webPreferences': {
      'webviewTag': true,
      'preload': `${process.cwd()}/src/app/preloads/index/preload.js`
    },
    // transparent: true,
    // titleBarStyle: 'hidden',
    frame: false,
    show: false
  })
  MainWindow.loadURL('file://' + distPath.views('/index/index.html'))

  MainWindow.on('closed', () => {
    MainWindow = null
  })

  ipcMain.handle('openFileDialog', openFileDialog)
  ipcMain.handle('openFolderDialog', openFolderDialog)
  ipcMain.handle('loadAnotationTarget', loadAnotationTarget)
  ipcMain.handle('getDatabaseInfo', getDatabaseInfo)
  ipcMain.handle('getImageViewList', getImageViewList)
  ipcMain.handle('copyFile', copyFile)
  ipcMain.on('domLoaded', domLoaded)
  ipcMain.on('exitApp', exitApp)
})
