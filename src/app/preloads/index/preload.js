const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  openFileDialog: (filters, dialogHistoryKey) => ipcRenderer.invoke('openFileDialog', filters, dialogHistoryKey),
  openFolderDialog: (dialogHistoryKey) => ipcRenderer.invoke('openFolderDialog', dialogHistoryKey),
  loadAnotationTarget: (anotationName, targetModel, trainyaml, targetDir, progressId) => ipcRenderer.invoke('loadAnotationTarget', anotationName, targetModel, trainyaml, targetDir, progressId),
  getDatabaseInfo: (progressId) => ipcRenderer.invoke('getDatabaseInfo', progressId),
  getAnotatedTree: () => ipcRenderer.invoke('getAnotatedTree'),
  saveAnotatedTree: (projectName, anotatedTree) => ipcRenderer.invoke('saveAnotatedTree', projectName, anotatedTree),
  getImageViewList: (imageViewDir) => ipcRenderer.invoke('getImageViewList', imageViewDir),
  copyFile: (srcPath, dialogHistoryKey) => ipcRenderer.invoke('copyFile', srcPath, dialogHistoryKey),
  openByExplorer: (openDir) => ipcRenderer.invoke('openByExplorer', openDir),
  domLoaded: () => ipcRenderer.invoke('domLoaded'),
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  closeWindow: (withExitApp = false) => ipcRenderer.send('closeWindow', withExitApp),
  exitApp: () => ipcRenderer.send('exitApp')
})