const fs = require('fs')
const { cutImgToBase64 } = require('../utils')
const { RootPath } = require('../globals')

function getDatabaseInfo(){
  return new Promise(async (res, rej) => {
    try{
      const databasePath = `${RootPath}/externalPackage/output`
      let databases = fs.readdirSync(databasePath)
      let itemsDirBuff
      let movieItemsDirBuff
      let itemPathBuff
      let itemAnotaioPathBuff
      let cutImagesBuff
      let result = {}

      for(d of databases){
        try{
          databasePathBuff = `${databasePath}/${d}`
          
          if(!fs.statSync(databasePathBuff).isDirectory()) continue

          itemsDirBuff = fs.readdirSync(databasePathBuff)
          result[d] = {}

          for(let i of itemsDirBuff){
            try{
              itemPathBuff = `${databasePathBuff}/${i}`
              
              if(fs.statSync(itemPathBuff).isDirectory()){
                movieItemsDirBuff = fs.readdirSync(itemPathBuff)
                result[d][i] = {}

                for(m of movieItemsDirBuff){
                  try{
                    if(m.split('.').slice(-1)[0] == 'jpg'){
                      result[d][i][m] = cvtImgToBase64(`${itemPathBuff}/${m}`)
                      // cutImagesBuff = await cutImgToBase64(itemPathBuff, itemAnotaioPathBuff)
                      // result[d][i][m] = cutImagesBuff[0]
                    }
                  }catch(err){continue}
                }
              }else if(fs.statSync(itemPathBuff).isFile()){
                if(itemPathBuff.split('.').slice(-1)[0] == 'jpg'){
                  itemAnotaioPathBuff = `${itemPathBuff}.txt`
                  
                  if(!fs.statSync(itemAnotaioPathBuff).isFile()) continue

                  // result[d][i] = cvtImgToBase64(itemPathBuff)
                  cutImagesBuff = await cutImgToBase64(itemPathBuff, itemAnotaioPathBuff)
                  result[d][i] = cutImagesBuff[0]
                }
              }
            }catch(err){continue}
          }
        }catch(err){continue}
      }

      return res(result)
    }catch(err){
      return rej(err)
    }
  })
}

module.exports= {
  getDatabaseInfo: getDatabaseInfo
}