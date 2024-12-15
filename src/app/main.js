const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { spawn } = require('child_process')
const fs = require('fs')
const jimp = require('jimp')
const imageSize = require('image-size')
const v8 = require('v8')

const {distPath} = require('../../dev/path');
const {getLastElement, getAllFilesRecursive} = require('./utils')

let AnotationProc

function cvtImgToBase64(path){
  let result

  if(path.split('.').slice(-1)[0] != 'jpg') return undefined

  try{
    if(!fs.statSync(path).isFile()) return undefined

    result = new Buffer(fs.readFileSync(path)).toString('base64')
  }catch(err){return undefined}

  return `data:image/jpg;base64,${result}`
}

function readAnotationFile(anotationTextPath){
  let fileStr
  let fileStrLineSplit
  let valueSplitBuff
  let result = []

  try{
    if(anotationTextPath.split('.').slice(-1)[0] != 'txt') return []
    if(!fs.statSync(anotationTextPath).isFile()) return []

    fileStr = fs.readFileSync(anotationTextPath).toString()
    fileStrLineSplit = fileStr.split('\n')

    for(let f of fileStrLineSplit){
      valueSplitBuff = f.split(' ')
      
      if(valueSplitBuff.length != 6) continue

      result.push({
        class: parseInt(valueSplitBuff[0]),
        x1: parseFloat(valueSplitBuff[1]),
        y1: parseFloat(valueSplitBuff[2]),
        x2: parseFloat(valueSplitBuff[3]),
        y2: parseFloat(valueSplitBuff[4]),
        pred: parseFloat(valueSplitBuff[5]),
      })
    }

    return result
  }catch(err){
    console.log(`ERROR: ${err}`)
    return []
  }
}

async function getBase64Async(jimpObj){
  return new Promise((res, rej) => {
    jimpObj.getBase64(jimp.MIME_JPEG, (err, src) => {
      if(err) rej(err)
      res(src)
    })
  })
}

async function cutImgToBase64(imgPath, anotationTextPath){
  let img
  let cropImgBuff
  let anotationDataList
  let result = []

  return new Promise(async (res, rej) => {
    try{
      anotationDataList = readAnotationFile(anotationTextPath)
  
      if(imgPath.split('.').slice(-1)[0] != 'jpg') return []
      if(!fs.statSync(imgPath).isFile()) return []
      if(anotationDataList.length == 0) return []

      for(let i in anotationDataList){
        img = await jimp.read(imgPath)
        cropImgBuff = await img.crop(
          anotationDataList[i].x1,
          anotationDataList[i].y1,
          (anotationDataList[i].x2 - anotationDataList[i].x1),
          (anotationDataList[i].y2 - anotationDataList[i].y1),
        )
        
        result.push(await getBase64Async(cropImgBuff))
      }
      res(result)
    }catch(err){res([])}
  })
}

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
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

  ipcMain.handle('openFileDialog', async (_, filters) => {
    return await dialog.showOpenDialogSync(mainWindow, { filters: filters ,properties: ['openFile'] });
  })

  ipcMain.handle('openFolderDialog', async () => {
    let dialogResult = await dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] })
    
    if(dialogResult == undefined) return undefined
    if(dialogResult.length == 0) return undefined
    else return dialogResult[0].replaceAll('\\', '/')
  })

  ipcMain.handle('loadAnotationTarget', async (_, anotationName, targetModel, targetDir) => {
    return new Promise((res, rej) => {
      let externalPackagePath = `${__dirname}/../../externalPackage`
      
      if(AnotationProc != undefined) return res({code: 0, mes: 'Anotation processing.'})
      if(anotationName == undefined | anotationName == '') return res({code: 0, mes: 'Empty name.'})
      if(targetModel == undefined | targetModel == '') return res({code: 0, mes: 'Empty target model.'})
      if(targetDir == undefined | targetDir == '') return res({code: 0, mes: 'Empty target directory.'})
      
      AnotationProc = spawn(
        `${externalPackagePath}/main.exe`, 
        [
          `--weights`, `${targetModel}`, 
          `--source`, `${targetDir}`, 
          `--outdir`, `${externalPackagePath}/output`, 
          `--name`, anotationName
        ]
      )

      console.log('START PROC')
  
      AnotationProc.on('close', (code) => {
        console.log(`CLOSED: ${code}`)
        AnotationProc = undefined

        if(code == 0) return res(true)
        else return res({code: 2, mes: `Subproces end at Code: ${code}`})
      })
    })
  })

  ipcMain.handle('getDatabaseInfo', async () => {
    return new Promise(async (res, rej) => {
      try{
        const databasePath = `${__dirname}/../../externalPackage/output`
        let databases = fs.readdirSync(databasePath)
        let itemsDirBuff
        let movieItemsDirBuff
        let itemPathBuff
        let itemAnotaioPathBuff
        let cutImagesBuff
        let result = {}

        for(d of databases){
          try{
            databasePathBuff = `${databasePath}/${d}`
            
            if(!fs.statSync(databasePathBuff).isDirectory()) continue

            itemsDirBuff = fs.readdirSync(databasePathBuff)
            result[d] = {}

            for(let i of itemsDirBuff){
              try{
                itemPathBuff = `${databasePathBuff}/${i}`
                
                if(fs.statSync(itemPathBuff).isDirectory()){
                  movieItemsDirBuff = fs.readdirSync(itemPathBuff)
                  result[d][i] = {}

                  for(m of movieItemsDirBuff){
                    try{
                      if(m.split('.').slice(-1)[0] == 'jpg'){
                        result[d][i][m] = cvtImgToBase64(`${itemPathBuff}/${m}`)
                        // cutImagesBuff = await cutImgToBase64(itemPathBuff, itemAnotaioPathBuff)
                        // result[d][i][m] = cutImagesBuff[0]
                      }
                    }catch(err){continue}
                  }
                }else if(fs.statSync(itemPathBuff).isFile()){
                  if(itemPathBuff.split('.').slice(-1)[0] == 'jpg'){
                    itemAnotaioPathBuff = `${itemPathBuff}.txt`
                    
                    if(!fs.statSync(itemAnotaioPathBuff).isFile()) continue

                    // result[d][i] = cvtImgToBase64(itemPathBuff)
                    cutImagesBuff = await cutImgToBase64(itemPathBuff, itemAnotaioPathBuff)
                    result[d][i] = cutImagesBuff[0]
                  }
                }
              }catch(err){continue}
            }
          }catch(err){continue}
        }

        return res(result)
      }catch(err){
        return rej(err)
      }
    })
  })

  ipcMain.handle('getImageViewList', async (_, imageViewDir) => {
    return new Promise((res, rej) => {
      let imgStatBuff
      let allPathList
      let allImgPathList = []
      let imgSizeBuff

      try{
        allPathList = getAllFilesRecursive(imageViewDir)
        
        for(ap of allPathList){
          if(!['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(getLastElement(ap.split('.')))) continue

          try{
            imgSizeBuff = imageSize.imageSize(ap)
            imgStatBuff = fs.statSync(ap)
            allImgPathList.push({
              imgSize:{w: imgSizeBuff.width, h: imgSizeBuff.height},
              dataSize: imgStatBuff.size,
              path: ap
            })
          }catch{
            continue
          }
        }

        res(allImgPathList)
      }catch(err){
        rej(err)
      }
    })
  })

  ipcMain.handle('copyFile', (_, srcPath) => {
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
  })

  ipcMain.on('exitApp', async () => {
    console.log("exit")
    mainWindow.close();
  })
});
