const fs = require('fs')

function getLastElement(list){
  return list[list.length - 1]
}

function getAllFilesRecursive(dir){
  let readList = fs.readdirSync(dir)
  let fileStat
  let pathList = []
  let pathBuff

  for(r of readList){
    pathBuff = `${dir}/${r}`
    fileStat = fs.statSync(pathBuff)
    
    if(fileStat.isDirectory()) pathList = pathList.concat(getAllFilesRecursive(pathBuff))
    else pathList.push(pathBuff.replaceAll('\\', '/'))
  }

  return pathList
}

module.exports= {
  getLastElement: getLastElement,
  getAllFilesRecursive: getAllFilesRecursive
}