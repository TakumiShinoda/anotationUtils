const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  openFileDialog: (filters, dialogHistoryKey) => ipcRenderer.invoke('openFileDialog', filters, dialogHistoryKey),
  openFolderDialog: (dialogHistoryKey) => ipcRenderer.invoke('openFolderDialog', dialogHistoryKey),
  loadAnotationTarget: (anotationName, targetModel, targetDir) => ipcRenderer.invoke('loadAnotationTarget', anotationName, targetModel, targetDir),
  getDatabaseInfo: () => ipcRenderer.invoke('getDatabaseInfo'),
  getImageViewList: (imageViewDir) => ipcRenderer.invoke('getImageViewList', imageViewDir),
  copyFile: (srcPath, dialogHistoryKey) => ipcRenderer.invoke('copyFile', srcPath, dialogHistoryKey),
  domLoaded: () => ipcRenderer.send('domLoaded'),
  exitApp: () => ipcRenderer.send('exitApp')
})