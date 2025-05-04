const fs = require('fs')
const { spawn } = require('child_process')

const { RootPath, ProgressServerPort } = require('../globals')

const CommandVenvPython = `${`${RootPath}/externalPackage/python/env/Scripts/python.exe`}`

function loadAnotationTarget(_, anotationName, targetModel, targetDir, progressId){
  return new Promise((res, rej) => {
    let autoAnotationPath = `${RootPath}/externalPackage/autoanotation`
    let commandArgs = [`${autoAnotationPath}/main.py`]

    try{
      if(anotationName == undefined | anotationName == '') throw 'Empty name.'
      if(targetModel == undefined | targetModel == '') throw 'Empty target model.'
      if(targetDir == undefined | targetDir == '') throw 'Empty target directory.'
      if(progressId == undefined | typeof(progressId) != 'number') throw 'Invalid progress id.'
      if(fs.existsSync(`${autoAnotationPath}/output/${anotationName}`)) throw 'Aleady exist name.'

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
        if(code != 0) rej(`Error at subprocess. Exit code: ${code}`)

        res()
      })

      proc.on('error', (err) => {
        rej(`Error at subprocess. Error: ${err}`)
      })
    }catch(err){rej(err.toString())}
  })
}

module.exports= {
  loadAnotationTarget: loadAnotationTarget,
}