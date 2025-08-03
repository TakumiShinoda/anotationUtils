const fsp = require('fs').promises
const xml2js = require("xml2js")

const PlantUmlPath = `${__dirname}/../..`
const OutputPath = `${__dirname}/output`

async function resetOutput(){
  try{
    await fsp.access(OutputPath)
    await fsp.rm(OutputPath, { recursive: true, force: true })
  }catch(err){
    if(!(err.code == 'ENOENT')) throw err
  }finally{
    await fsp.mkdir(OutputPath)
  }
}

function checkExistKey(targetDict, key, withError = true){
  if(Object.keys(targetDict).indexOf(key) < 0){
    if(withError) throw(`Not exist key: ${key}`)
    else return false 
  }

  return true
}

async function parseFromSvg(svgPath){
  let targetFile
  let targetJson
  let idBuff
  let detailBuff
  let linkIdsBuff
  let result = {}

  return new Promise(async (res, rej) => {
    try{
      targetFile = await fsp.readFile(svgPath, 'utf-8')
      targetJson = await xml2js.parseStringPromise(targetFile)

      checkExistKey(targetJson, 'svg')
      checkExistKey(targetJson['svg'], 'g')
      checkExistKey(targetJson['svg']['g'][0], 'g')

      for(let go of targetJson['svg']['g'][0]['g']){
        // console.log(go)
        
        if(
          checkExistKey(go, 'rect', false) &&
          checkExistKey(go, 'text', false)
        ){
          idBuff = undefined
          detailBuff = undefined

          for(to of go['text']){
            if(!checkExistKey(to, '_', false)) continue
            if(
              !to['_'].startsWith('id = ') &&
              !to['_'].startsWith('detail = ')
            ) continue

            if(to['_'].startsWith('id = ')) idBuff = to['_'].replaceAll('id = ', '')
            if(to['_'].startsWith('detail = ')) detailBuff = to['_'].replaceAll('detail = ', '')
          }

          if(
            (idBuff == undefined) ||
            (detailBuff == undefined)
          ) continue

          result[idBuff] = {detail: detailBuff}
          result[idBuff]['child'] = []
        }
        
        if(checkExistKey(go, 'path', false)){
          for(let po of go['path']){
            if(!checkExistKey(po, '$', false)) continue
            if(!checkExistKey(po['$'], 'id', false)) continue

            linkIdsBuff = po['$']['id'].split('-backto-')

            if(linkIdsBuff.length != 2) continue

            linkIdsBuff[0] = linkIdsBuff[0].replaceAll('_', '-')
            linkIdsBuff[1] = linkIdsBuff[1].replaceAll('_', '-')

            if(!checkExistKey(result, linkIdsBuff[0], false)) continue
            if(!checkExistKey(result, linkIdsBuff[1], false)) continue

            result[linkIdsBuff[0]]['child'].push(linkIdsBuff[1])
          }
        }
      }

      res(result)
    }catch(err){
      rej(err)
    }
  })
}

(async () => {
  let parsedJson

  try{
    await resetOutput()

    parsedJson = await parseFromSvg(`${PlantUmlPath}/imaged/main.svg`)

    fsp.writeFile(`${OutputPath}/parsed.json`, JSON.stringify(parsedJson, undefined, 2))
    console.log(parsedJson)
  }catch(err){
    console.log(`Err: ${err}`)
  }
})()