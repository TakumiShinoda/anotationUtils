const { dialog,  } = require('electron');
const fs = require('fs')

const { getLastElement } = require('../utils')
const { saveDialogHistory } = require('../mods/dialogHistory')

const DefaultDialogPath = 'C:\\'

function openFileDialog(_, filters, dialogHistoryKey){
  let dialogPath = DefaultDialogPath
  let dialogResult

  if(Object.keys(DialogHistory).indexOf(dialogHistoryKey) >= 0) dialogPath = DialogHistory[dialogHistoryKey]

  dialogResult = dialog.showOpenDialogSync(MainWindow, {
    filters: filters, 
    properties: ['openFile'], 
    defaultPath: dialogPath.replaceAll('/', '\\')
  })

  if(dialogResult == undefined) return undefined

  dialogResult = dialogResult[0].replaceAll('\\', '/')
  DialogHistory[dialogHistoryKey] = dialogResult
  saveDialogHistory()

  return dialogResult
}

function openFolderDialog(_, dialogHistoryKey){
  let dialogPath = DefaultDialogPath
  let dialogResult
  
  if(Object.keys(DialogHistory).indexOf(dialogHistoryKey) >= 0) dialogPath = DialogHistory[dialogHistoryKey]
  
  dialogResult = dialog.showOpenDialogSync(MainWindow, {
    properties: ['openDirectory'],
    defaultPath: dialogPath.replaceAll('/', '\\')
  })

  if(dialogResult == undefined) return undefined

  dialogResult = dialogResult[0].replaceAll('\\', '/')
  DialogHistory[dialogHistoryKey] = dialogResult
  saveDialogHistory()
    
  if(dialogResult == undefined) return undefined
  if(dialogResult.length == 0) return undefined
  else return dialogResult
}

function copyFile(_, srcPath, dialogHistoryKey){
  return new Promise((res, rej) => {
    let dialogResult
    let dialogPath = DefaultDialogPath
    let srcFileName = getLastElement(srcPath.split('/'))
    let srcFileExtension = getLastElement(srcFileName.split('.'))

    if(Object.keys(DialogHistory).indexOf(dialogHistoryKey) >= 0) dialogPath = DialogHistory[dialogHistoryKey]

    try{
      dialogResult = dialog.showSaveDialogSync({
        defaultPath: `${dialogPath.replaceAll('/', '\\')}\\${srcFileName}`,
        filters:[
          {name: 'Image', extensions: [srcFileExtension]}
        ]
      })

      if(dialogResult == undefined){
        res(undefined)
        return
      }

      dialogResult = dialogResult.replaceAll('\\', '/')
      DialogHistory[dialogHistoryKey] = dialogResult.split('/').slice(0, -1).join('/')
      saveDialogHistory()

      if(dialogResult != undefined) fs.copyFileSync(srcPath, dialogResult)

      res(dialogResult)
    }catch(err){
      rej(err)
    }
  })
}

module.exports = {
  openFileDialog: openFileDialog,
  openFolderDialog: openFolderDialog,
  copyFile: copyFile
}