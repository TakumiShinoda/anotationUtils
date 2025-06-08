const express = require('express')
const { app, BrowserWindow, ipcMain } = require('electron')

const { distPath } = require('../../dev/path')
const { getImageViewList, openByExplorer } = require('./ipcMains/ImageViewer')
const { copyFile, openFileDialog, openFolderDialog } = require('./ipcMains/dialogs')
const { exitApp, domLoaded, maximizeWindow, minimizeWindow, closeWindow } = require('./ipcMains/system')
const { loadAnotationTarget } = require('./ipcMains/autoAnotation')
const { getAnotatedTree, saveAnotatedTree } = require('./ipcMains/anotatedImage')
const { loadDialogHistory } = require('./mods/dialogHistory')
const { httpApiProgress } = require('./httpServer/progressServer')
const { ProgressServerPort } = require('./globals')

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
      'preload': `${__dirname}/preloads/index/preload.js`
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
  // ipcMain.handle('getDatabaseInfo', getDatabaseInfo)
  ipcMain.handle('getAnotatedTree', getAnotatedTree)
  ipcMain.handle('saveAnotatedTree', saveAnotatedTree)
  ipcMain.handle('getImageViewList', getImageViewList)
  ipcMain.handle('openByExplorer', openByExplorer)
  ipcMain.handle('copyFile', copyFile)
  ipcMain.handle('domLoaded', domLoaded)
  ipcMain.on('maximizeWindow', maximizeWindow)
  ipcMain.on('minimizeWindow', minimizeWindow)
  ipcMain.on('closeWindow', closeWindow)
  ipcMain.on('exitApp', exitApp)

  ExpressApp = express()
  ExpressServer = ExpressApp.listen(ProgressServerPort)
  
  ExpressApp.get('/api/progress', httpApiProgress)
})
