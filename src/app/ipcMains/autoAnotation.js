const { spawn } = require('child_process')

require('../globals')

function loadAnotationTarget(_, anotationName, targetModel, targetDir){
  return new Promise((res, rej) => {
    let externalPackagePath = `${__dirname}/../../../externalPackage`
    
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
}

module.exports= {
  loadAnotationTarget: loadAnotationTarget
}