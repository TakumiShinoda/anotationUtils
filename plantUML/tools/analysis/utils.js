const fsp = require('fs').promises

const globals = require(`${__dirname}/globals.js`)

async function resetFile(path){
  try{
    await fsp.rm(path)
  }catch(err){
  }finally{
    return
  }
}

async function resetDir(path){
  try{
    await fsp.access(path)
    await fsp.rm(path, { recursive: true, force: true })
  }catch(err){
    if(!(err.code == 'ENOENT')) throw err
  }finally{
    await fsp.mkdir(path)
  }
}

async function resetOutput(){
  await resetDir(globals.OutputPath)
}

module.exports = {
  resetFile: resetFile,
  resetDir: resetDir,
  resetOutput: resetOutput
}