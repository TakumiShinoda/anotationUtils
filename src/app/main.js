const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const electronReload = require('electron-reload')(['./dist/bundles/**', './dist/js/**', './dist/views/**']);

const {distPath} = require('../../dev/path');

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
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

  ipcMain.handle('openFileDialog', async (_, filters) => {
    return await dialog.showOpenDialogSync(mainWindow, { filters: filters ,properties: ['openFile'] });
  })

  ipcMain.handle('openFolderDialog', async () => {
    return await dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] });
  })

  ipcMain.on('exitApp', async () => {
    console.log("exit")
    mainWindow.close();
  })
});
