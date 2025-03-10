const fs = require('fs')

const { RootPath } = require('../globals')

const DialogHistoryPath = `${RootPath}/settings/dialogHistory.json`

function loadDialogHistory(){
  let fileString
  let fileJson
  let result = {
    'autoAnotationModelPathDialog': '',
    'autoAnotationImagePathDialog': '',
    'imageViewerOpenFolderDialog': '',
    'imageViewerSaveImgDialog': ''
  }

  try{
    fileString = fs.readFileSync(DialogHistoryPath).toString()
    fileJson = JSON.parse(fileString)

    for(let key in result){
      try{
        if(fileJson[key] == undefined) continue
        if(
          !fs.statSync(fileJson[key]).isDirectory() &&
          !fs.statSync(fileJson[key]).isFile()
        ) continue

        result[key] = fileJson[key]
      }catch{ continue }
    }
  }catch(err){
    console.log(err)
  }finally{
    fs.writeFileSync(DialogHistoryPath, JSON.stringify(result))
  }

  return result
}

function saveDialogHistory(){
  let dialogHistoryStr = JSON.stringify(DialogHistory)

  fs.writeFileSync(DialogHistoryPath, dialogHistoryStr)
}

module.exports = {
  loadDialogHistory: loadDialogHistory,
  saveDialogHistory: saveDialogHistory
}