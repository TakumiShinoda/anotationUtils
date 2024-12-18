const { dialog } = require('electron');
const fs = require('fs')

const { getLastElement } = require('../utils');

function openFileDialog(_, filters){
  return dialog.showOpenDialogSync({ filters: filters ,properties: ['openFile'] });
}

function openFolderDialog(){
  let dialogResult = dialog.showOpenDialogSync(MainWindow, { properties: ['openDirectory'] })
    
  if(dialogResult == undefined) return undefined
  if(dialogResult.length == 0) return undefined
  else return dialogResult[0].replaceAll('\\', '/')
}

function copyFile(_, srcPath){
  return new Promise((res, rej) => {
    let distPath
    let srcFileName = getLastElement(srcPath.split('/'))
    let srcFileExtension = getLastElement(srcFileName.split('.'))

    try{
      distPath = dialog.showSaveDialogSync({
        defaultPath: srcFileName,
        filters:[
          {name: 'Image', extensions: [srcFileExtension]}
        ]
      })

      if(distPath != undefined) fs.copyFileSync(srcPath, distPath)

      res(distPath)
    }catch(err){
      rej(err)
    }
  })
}

module.exports= {
  openFileDialog: openFileDialog,
  openFolderDialog: openFolderDialog,
  copyFile: copyFile
}