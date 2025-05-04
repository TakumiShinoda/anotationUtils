const fs = require('fs')
const { spawn } = require('child_process')

const { RootPath, ProgressServerPort } = require('../globals')

const CommandVenvPython = `${`${RootPath}/externalPackage/python/env/Scripts/python.exe`}`

function loadAnotationTarget(_, anotationName, targetModel, targetDir, progressId){
  return new Promise((res, rej) => {
    let autoAnotationPath = `${RootPath}/externalPackage/autoanotation`
    let commandArgs = [`${autoAnotationPath}/main.py`]

    try{
      if(anotationName == undefined | anotationName == ''){
        res({code: 0, mes: 'Empty name.'})
        return
      }
      if(targetModel == undefined | targetModel == ''){
        res({code: 0, mes: 'Empty target model.'})
        return
      }
      if(targetDir == undefined | targetDir == ''){
        res({code: 0, mes: 'Empty target directory.'})
        return
      }
      if(progressId == undefined | typeof(progressId) != 'number'){
        res({code: 0, mes: 'Invalid progress id.'})
        return
      }
      if(fs.existsSync(`${autoAnotationPath}/output/${anotationName}`)){
        res({code: 0, mes: 'Aleady exist name.'})
        return
      }

      commandArgs = commandArgs.concat([`--weights`, `${targetModel}`])
      commandArgs = commandArgs.concat([`--source`, `${targetDir}`])
      commandArgs = commandArgs.concat([`--outdir`, `${autoAnotationPath}/output`])
      commandArgs = commandArgs.concat([`--name`, anotationName])
      commandArgs = commandArgs.concat([`--progId`, progressId])
      commandArgs = commandArgs.concat([`--progServerPort`, ProgressServerPort])

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
        res({code: 2, mes: `Subproces end at Code: ${code}`})
      })
    }catch(err){rej(err)}
  })
}

module.exports= {
  loadAnotationTarget: loadAnotationTarget,
}