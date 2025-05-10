const fs = require('fs').promises
const yaml = require('js-yaml')
const { cutImgToBase64, getLastElement, isExistFile, readAnotationFile } = require('../utils')
const { RootPath } = require('../globals')

function loadClassesFromTrainYaml(trainYamlPath){
  let trainYamlFile
  let trainYamlObj
  let result

  return new Promise(async (res, rej) => {
    try{
      trainYamlFile = await fs.readFile(trainYamlPath)
      trainYamlObj = yaml.load(trainYamlFile)
  
      if(Object.keys(trainYamlObj).indexOf('names') < 0) throw 'Invalid train yaml.'
  
      result = trainYamlObj['names']
      
      if(!Array.isArray(result)) throw 'Invalid train yaml.'

      res(result)
    }catch(err){rej(err)}
  })
}

function getAnotatedTree(_){
  const SupportImageExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'bmp', 'tiff']
  const AnotatedOutputPath = `${RootPath}/externalPackage/autoanotation/output`

  let anotatedOutputDirBuff
  let projectNameBuff
  let imgPathListBuff
  let classesBuff
  let anotatedLoadDataBuff
  let anotateDataBuff
  let tagBuff
  let result = {}

  return new Promise(async (res, rej) => {
    try{
      projectNameBuff = await fs.readdir(AnotatedOutputPath, {withFileTypes: true})

      for(let pn of projectNameBuff){
        if(!pn.isDirectory()) continue

        anotatedOutputDirBuff = `${AnotatedOutputPath}/${pn.name}`

        classesBuff = await loadClassesFromTrainYaml(`${anotatedOutputDirBuff}/train.yaml`)
        imgPathListBuff = await fs.readdir(anotatedOutputDirBuff, {withFileTypes: true})
        result[pn.name] = []

        for(let ip of imgPathListBuff){
          if(!ip.isFile()) continue
          if(SupportImageExtensions.indexOf(getLastElement(ip.name.split('.'))) < 0) continue
          if(!await isExistFile(`${anotatedOutputDirBuff}/${ip.name}.txt`)) continue

          try{anotatedLoadDataBuff = await readAnotationFile(`${anotatedOutputDirBuff}/${ip.name}.txt`)}
          catch(err){continue}

          anotateDataBuff = {}
          for(let ald of anotatedLoadDataBuff){
            if(ald.class >= classesBuff.length) tagBuff = 'undefined'
            else tagBuff = classesBuff[ald.class]

            if(Object.keys(anotateDataBuff).indexOf(tagBuff) < 0) anotateDataBuff[tagBuff] = []
            
            anotateDataBuff[tagBuff].push({x1: ald.x1, y1: ald.y1, x2: ald.x2, y2: ald.y2})
          }

          result[pn.name].push({
            path: `${AnotatedOutputPath}/${pn.name}/${ip.name}`,
            anotateData: anotateDataBuff
          })
        }
      }

      res(result)
    }catch(err){rej(err)}
  })
}

function getDatabaseInfo(_, progressId){
  return new Promise(async (res, rej) => {
    try{
      const databasePath = `${RootPath}/externalPackage/autoanotation/output`
      let databases = fs.readdirSync(databasePath)
      let itemsDirBuff
      let movieItemsDirBuff
      let itemPathBuff
      let itemAnotaioPathBuff
      let cutImagesBuff
      let progressCnt = 0
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
        }catch(err){
          console.log(err)
        }finally{
          progressCnt++
          MainWindow.webContents.send('ipcProgressOn', progressId, (progressCnt / databases.length))
        }
      }

      return res(result)
    }catch(err){
      return rej(err)
    }
  })
}

module.exports= {
  getAnotatedTree: getAnotatedTree,
  // getDatabaseInfo: getDatabaseInfo
}