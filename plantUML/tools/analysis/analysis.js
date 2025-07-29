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
  let result = {}

  return new Promise(async (res, rej) => {
    try{
      targetFile = await fsp.readFile(svgPath, 'utf-8')
      targetJson = await xml2js.parseStringPromise(targetFile)

      checkExistKey(targetJson, 'svg')
      checkExistKey(targetJson['svg'], 'g')
      checkExistKey(targetJson['svg']['g'][0], 'g')

      for(let go of targetJson['svg']['g'][0]['g']){
        if(
          !checkExistKey(go, 'rect', false) ||
          !checkExistKey(go, 'text', false)
        ) continue

        console.log(go)

        for(to of go['text']){
          if(!checkExistKey(to, '_', false)) continue
          if(!to['_'].startsWith('id = ')) continue

          result[to['_'].replaceAll('id = ', '')] = {}
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

    parsedJson = await parseFromSvg(`${PlantUmlPath}/imaged/l4/l4_27.svg`)

    fsp.writeFile(`${OutputPath}/parsed.json`, JSON.stringify(parsedJson, undefined, 2))
    console.log(parsedJson)
  }catch(err){
    console.log(`Err: ${err}`)
  }
})()