const fs = require('fs')
const fsp = require('fs').promises
const jimp = require('jimp')
const { spawn } = require('child_process')

const { RootPath } = require('./globals')

const CommandVenvPython = `${`${RootPath}/externalPackage/python/env/Scripts/python.exe`}`

function getLastElement(list){
  return list[list.length - 1]
}

async function isExistFile(path){
  try{
    await fsp.access(path, fsp.constants.F_OK)
    return true
  }catch(_){return false}
}

async function getAllFilesRecursive(dir, filterFileName = []){
  const CommandArgsTemp = [
    `${RootPath}/src/assets/python/getAllFilesRecursive.py`,
    '--dir', dir,
    '--outputJsonDir', `${RootPath}/temp`,
  ]
  
  let proc
  let commandArgs = CommandArgsTemp
  let procResultStr
  let procResult

  return new Promise((res, rej) => {
    try{
      if(filterFileName.length != 0){
        commandArgs.push('--filterFileName')
        commandArgs = commandArgs.concat(filterFileName)
      }

      proc = spawn(
        CommandVenvPython,
        commandArgs,
        { 
          shell: false,
          windowsHide: true,
          stdio: ["pipe", "pipe", "inherit"],
        }
      )

      proc.stdout.on('data', (data) => {
        console.log(data.toString())
        debugPrint(MainWindow, `getAllFilesRecursive stdout: ${data.toString()}`)
      })
  
      proc.on('close', (code) => {
        console.log(`proc code ${code}`)
        debugPrint(MainWindow, `proc code ${code}`)

        if(code != 0) throw `Proc code ${code}.`
        
        procResultStr = fs.readFileSync(`${RootPath}/temp/getAllFilesRecursive.json`)
        procResult = JSON.parse(procResultStr)

        if(Object.keys(procResult).indexOf('result') < 0) throw 'Invalid result.'
        if(!(procResult['result'] instanceof Array)) throw 'Invalid result.'

        fs.unlinkSync(`${RootPath}/temp/getAllFilesRecursive.json`)
        
        res(procResult['result'])
      })
    }catch(err){
      rej(`getAllFilesRecursive err: ${err}`)
    }
  })
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

function cvtImgToBase64(path){
  let result

  if(path.split('.').slice(-1)[0] != 'jpg') return undefined

  try{
    if(!fs.statSync(path).isFile()) return undefined

    result = new Buffer(fs.readFileSync(path)).toString('base64')
  }catch(err){return undefined}

  return `data:image/jpg;base64,${result}`
}

function getBase64Async(jimpObj){
  return new Promise((res, rej) => {
    jimpObj.getBase64(jimp.MIME_JPEG, (err, src) => {
      if(err) rej(err)
      res(src)
    })
  })
}

function cutImgToBase64(imgPath, anotationTextPath){
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

async function wait(millis){
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, millis)
  })
}

function debugPrint(browserWindow, mes){
  if(browserWindow == undefined) return

  browserWindow.webContents.send('debugPrint', `debugPrint: ${mes}`)
}

module.exports= {
  getLastElement: getLastElement,
  isExistFile: isExistFile,
  getAllFilesRecursive: getAllFilesRecursive,
  readAnotationFile: readAnotationFile,
  cvtImgToBase64: cvtImgToBase64,
  getBase64Async: getBase64Async,
  cutImgToBase64: cutImgToBase64,
  wait: wait,
  debugPrint: debugPrint
}