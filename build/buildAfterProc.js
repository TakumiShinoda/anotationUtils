const fsp = require('fs').promises
const path = require('path')

const TargetDir = `${__dirname}/../publish.temp`
const DestDir = `${__dirname}/../publish`
const RemoveExcludes = [
  `${DestDir}/win-unpacked/externalPackage`
]

async function isExistFolder(dir){
  try{
    let stat = await fsp.stat(dir)

    return stat.isDirectory()
  }catch(_){return false}
}

async function removeDirRecursiveWithExclusive(targetDir, exclusivePaths = []){
  let targetDirResolve = path.resolve(targetDir).replaceAll('\\', '/')
  let exclusiveResolvePaths = []
  let dirsBuff = await fsp.readdir(targetDirResolve, {withFileTypes: true})
  let resolvePathBuff

  for(let exp of exclusivePaths){
    exclusiveResolvePaths.push(path.resolve(exp).replaceAll('\\', '/'))
  }

  for(let d of dirsBuff){
    resolvePathBuff = path.resolve(`${targetDirResolve}/${d.name}`).replaceAll('\\', '/')

    if(exclusiveResolvePaths.includes(resolvePathBuff)) continue
    
    if(d.isDirectory()) await removeDirRecursiveWithExclusive(resolvePathBuff, exclusiveResolvePaths)
    else await fsp.unlink(resolvePathBuff)
  }

  dirsBuff = await fsp.readdir(targetDirResolve)

  if(dirsBuff.length == 0) await fsp.rmdir(targetDirResolve)
}

async function copyAllRecursive(targetDir, destDir){
  let targetDirResolve = path.resolve(targetDir).replaceAll('\\', '/')
  let destDirResolve = path.resolve(destDir).replaceAll('\\', '/')
  let targetDirs = await fsp.readdir(targetDirResolve, {withFileTypes: true})
  let resolvePathBuff

  for(let d of targetDirs){
    resolvePathBuff = path.resolve(`${targetDirResolve}/${d.name}`).replaceAll('\\', '/')

    if(d.isDirectory()) await copyAllRecursive(resolvePathBuff, `${destDirResolve}/${d.name}`)
    else{
      await fsp.mkdir(destDirResolve, {recursive: true})
      await fsp.copyFile(`${targetDirResolve}/${d.name}`, `${destDirResolve}/${d.name}`)
    }
  }
}

(async () => {
  try{
    if(!(await isExistFolder(DestDir))) await fsp.mkdir(DestDir)

    await removeDirRecursiveWithExclusive(DestDir, RemoveExcludes)
    await copyAllRecursive(TargetDir, DestDir)
    await fsp.rm(TargetDir, {recursive: true, force: true})
  }catch(err){
    console.log('Error:', err)
    process.exit(1)
  }
})()