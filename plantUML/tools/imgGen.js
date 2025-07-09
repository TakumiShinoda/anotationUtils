const plantuml = require('node-plantuml-latest')
const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')

const JarFilePath = `${__dirname}/plantuml-mit-1.2025.4.jar`
const InputDir = `${__dirname}/..`
const OutputDir = `${__dirname}/../imaged`
const EntryDirs = [
  `${InputDir}/l1`,
  `${InputDir}/l2`,
  `${InputDir}/l3`,
  `${InputDir}/l4`,
  `${InputDir}/l5`
]

function getLastElement(list){
  return list[list.length - 1]
}

async function getFilePathList(dir){
  let entries = await fsp.readdir(dir, {withFileTypes: true})
  let result = []

  for(let e of entries){
    if(e.isDirectory()) continue

    result.push(path.resolve(`${dir}/${e.name}`).replaceAll('\\', '/'))
  }

  return result
}   

async function generateImg(inputPuPath, outputImagePath, imgType = 'svg'){
  let generator
  let imageWriteStream
  let absInputPuPath = path.resolve(inputPuPath).replaceAll('\\', '/')

  return new Promise(async (res, rej) => {
    try{
      await fsp.access(absInputPuPath)

      imageWriteStream = fs.createWriteStream(outputImagePath)

      imageWriteStream.on('finish', () => {
        res(true)
      })

      imageWriteStream.on('error', (err) => {
        console.log('generateImg > imageWriteStream: ', err)
        rej(false)
      })

      generator = plantuml.generate(
        absInputPuPath,
        {
          format: imgType,
          jarPath: JarFilePath,
          include: absInputPuPath.split('/').slice(0, -1).join('/')
        }
      )

      generator.out.pipe(imageWriteStream)
    }catch(err){
      console.log('generateImg: ', err)
      rej(false)
    }
  })
}

(async () => {
  let filePathListBuff
  let inputFileNameBuff
  let outputFileNameBuff
  let outputDirNameBuff

  await fsp.rm(OutputDir, {recursive: true, force: true})
  await fsp.mkdir(OutputDir)

  await generateImg(`${InputDir}/main.pu`, `${OutputDir}/main.svg`)
  await generateImg(`${InputDir}/legend.pu`, `${OutputDir}/legend.svg`)

  for(let ed of EntryDirs){
    filePathListBuff = await getFilePathList(ed)
    outputDirNameBuff = getLastElement(ed.split('/'))

    for(let fp of filePathListBuff){
      inputFileNameBuff = getLastElement(fp.split('/'))
      outputFileNameBuff = `${inputFileNameBuff.split('.')[0]}.svg`

      try{
        await fsp.mkdir(`${OutputDir}/${outputDirNameBuff}`)
      }catch(err){
        if(err.code != 'EEXIST'){
          console.log('Error', err)
          return
        }
      }finally{
        await generateImg(`${ed}/${inputFileNameBuff}`, `${OutputDir}/${outputDirNameBuff}/${outputFileNameBuff}`)
      }
    }
  }
})()