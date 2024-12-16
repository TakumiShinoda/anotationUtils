const fs = require('fs')
const jimp = require('jimp')

function getLastElement(list){
  return list[list.length - 1]
}

function getAllFilesRecursive(dir){
  let readList = fs.readdirSync(dir)
  let fileStat
  let pathList = []
  let pathBuff

  for(r of readList){
    pathBuff = `${dir}/${r}`
    fileStat = fs.statSync(pathBuff)
    
    if(fileStat.isDirectory()) pathList = pathList.concat(getAllFilesRecursive(pathBuff))
    else pathList.push(pathBuff.replaceAll('\\', '/'))
  }

  return pathList
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

module.exports= {
  getLastElement: getLastElement,
  getAllFilesRecursive: getAllFilesRecursive,
  readAnotationFile: readAnotationFile,
  cvtImgToBase64: cvtImgToBase64,
  getBase64Async: getBase64Async,
  cutImgToBase64: cutImgToBase64
}