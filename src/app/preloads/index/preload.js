const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  openFileDialog: (filters, dialogHistoryKey) => ipcRenderer.invoke('openFileDialog', filters, dialogHistoryKey),
  openFolderDialog: (dialogHistoryKey) => ipcRenderer.invoke('openFolderDialog', dialogHistoryKey),
  loadAnotationTarget: (anotationName, targetModel, targetDir) => ipcRenderer.invoke('loadAnotationTarget', anotationName, targetModel, targetDir),
  getDatabaseInfo: (progressId) => ipcRenderer.invoke('getDatabaseInfo', progressId),
  getImageViewList: (imageViewDir) => ipcRenderer.invoke('getImageViewList', imageViewDir),
  copyFile: (srcPath, dialogHistoryKey) => ipcRenderer.invoke('copyFile', srcPath, dialogHistoryKey),
  openByExplorer: (openDir) => ipcRenderer.invoke('openByExplorer', openDir),
  domLoaded: () => ipcRenderer.invoke('domLoaded'),
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  closeWindow: (withExitApp = false) => ipcRenderer.send('closeWindow', withExitApp),
  exitApp: () => ipcRenderer.send('exitApp')
})