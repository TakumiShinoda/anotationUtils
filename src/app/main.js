const { app, BrowserWindow, dialog, ipcMain } = require('electron');

const {distPath} = require('../../dev/path');
const { getImageViewList } = require('./ipcMains/ImageViewer');
const { copyFile, openFileDialog, openFolderDialog } = require('./ipcMains/dialogs');
const { exitApp } = require('./ipcMains/system');
const { loadAnotationTarget } = require('./ipcMains/autoAnotation');
const { getDatabaseInfo } = require('./ipcMains/anotatedImage');

require('electron-reload')(['./dist/bundles/**']);
require('./globals')

AnotationProc = undefined

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    resizable: true,
    movable: true,
    'webPreferences': {
      'webviewTag': true,
      'preload': `${__dirname}/preload.js`
    },
    // transparent: true,
    // titleBarStyle: 'hidden',
    frame: false,
  });
  mainWindow.loadURL('file://' + distPath.views('/index/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.handle('openFileDialog', openFileDialog)
  ipcMain.handle('openFolderDialog', openFolderDialog)
  ipcMain.handle('loadAnotationTarget', loadAnotationTarget)
  ipcMain.handle('getDatabaseInfo', getDatabaseInfo)
  ipcMain.handle('getImageViewList', getImageViewList)
  ipcMain.handle('copyFile', copyFile)
  ipcMain.on('exitApp', exitApp)
});
