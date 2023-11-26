const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: (filters) => ipcRenderer.invoke('openFileDialog', filters),
  openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
  loadAnotationTarget: (anotationName, targetModel, targetDir) => ipcRenderer.invoke('loadAnotationTarget', anotationName, targetModel, targetDir),
  exitApp: () => ipcRenderer.send('exitApp')
})