const fs = require('fs').promises
const yaml = require('js-yaml')
const { z } = require('zod')
const { getLastElement, isExistFile, readAnotationFile } = require('../utils')
const { RootPath } = require('../globals')

const AnotatedOutputPath = `${RootPath}/externalPackage/autoanotation/output`
const ProjectFileName = 'project.json'
const ProjectFileScema = z.object({
  project: z.array(
    z.object({
      path: z.string(),
      anotateData: z.record(
        z.array(
          z.object({
            x1: z.number(),
            y1: z.number(),
            x2: z.number(),
            y2: z.number(),
            selected: z.boolean()
          })
        )
      )
    })
  )
})

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

function loadProjectFromDir(dir){
  const SupportImageExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'bmp', 'tiff']

  let imgPathListBuff
  let classesBuff
  let anotatedLoadDataBuff
  let anotateDataBuff
  let tagBuff
  let result = []

  return new Promise(async (res, rej) => {
    try{
      if(!(await fs.stat(dir)).isDirectory()) throw 'Dir not found.'

      classesBuff = await loadClassesFromTrainYaml(`${dir}/train.yaml`)
      imgPathListBuff = await fs.readdir(dir, {withFileTypes: true})

      for(let ip of imgPathListBuff){
        if(!ip.isFile()) continue
        if(SupportImageExtensions.indexOf(getLastElement(ip.name.split('.'))) < 0) continue
        if(!await isExistFile(`${dir}/${ip.name}.txt`)) continue

        try{anotatedLoadDataBuff = await readAnotationFile(`${dir}/${ip.name}.txt`)}
        catch(err){continue}

        anotateDataBuff = {}
        for(let ald of anotatedLoadDataBuff){
          if(ald.class >= classesBuff.length) tagBuff = 'undefined'
          else tagBuff = classesBuff[ald.class]

          if(Object.keys(anotateDataBuff).indexOf(tagBuff) < 0) anotateDataBuff[tagBuff] = []
          
          anotateDataBuff[tagBuff].push({x1: ald.x1, y1: ald.y1, x2: ald.x2, y2: ald.y2, selected: true})
        }

        result.push({
          path: `${dir}/${ip.name}`,
          anotateData: anotateDataBuff
        })
      }

      res(result)
    }catch(err){rej(err)}
  })
}

function loadProjectFromData(dir){
  let projectFilePath = `${dir}/${ProjectFileName}`
  let jsonFile
  let jsonData

  return new Promise(async (res, rej) => {
    try{
      if(!(await fs.stat(projectFilePath)).isFile()) throw 'File not found.'

      jsonFile = await fs.readFile(projectFilePath)
      jsonData = JSON.parse(jsonFile)

      if(!ProjectFileScema.safeParse(jsonData).success) throw 'Invalid project file.'

      res(jsonData['project'])
    }catch(err){rej(err)}
  })
}

function getAnotatedTree(_){
  let anotatedOutputDirBuff
  let projectNameBuff
  let result = {}

  return new Promise(async (res, rej) => {
    try{
      projectNameBuff = await fs.readdir(AnotatedOutputPath, {withFileTypes: true})

      for(let pn of projectNameBuff){
        if(!pn.isDirectory()) continue

        anotatedOutputDirBuff = `${AnotatedOutputPath}/${pn.name}`

        try{
          result[pn.name] = await loadProjectFromData(anotatedOutputDirBuff)
        }catch(err){
          result[pn.name] =  await loadProjectFromDir(anotatedOutputDirBuff)
        }
      }

      res(result)
    }catch(err){rej(err)}
  })
}

function saveAnotatedTree(_, projectName, anotatedTree){
  let saveDir = `${AnotatedOutputPath}/${projectName}`
  let saveJsonData

  return new Promise(async (res, rej) => {
    try{
      if(!(await fs.stat(saveDir)).isDirectory()) throw 'Invalid project name.'

      saveJsonData = {'project': anotatedTree}

      await fs.writeFile(`${saveDir}/${ProjectFileName}`, JSON.stringify(saveJsonData))

      res()
    }catch(err){rej(err)}
  })
}

module.exports= {
  getAnotatedTree: getAnotatedTree,
  saveAnotatedTree: saveAnotatedTree
}