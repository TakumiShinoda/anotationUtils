const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: (filters) => ipcRenderer.invoke('openFileDialog', filters),
  openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
  exitApp: () => ipcRenderer.send('exitApp')
})