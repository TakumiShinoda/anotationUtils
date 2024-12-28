const fs = require('fs')
// const imageSize = require('image-size')
const imageSize = require('probe-image-size')

const { getAllFilesRecursive, getLastElement } = require('../utils')

function getImageViewList(_, imageViewDir){
  return new Promise(async (res, rej) => {
    const ParallelProcLimit = 1000

    let imgStatBuff
    let allPathList
    let promises = []
    let allImgPathList = []
    let imgSizeBuff
    let parallelProcCnt = 0

    try{
      allPathList = getAllFilesRecursive(imageViewDir)
      
      for(let [i, ap] of Object.entries(allPathList)){
        if(!['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif', 'bmp', 'tiff'].includes(getLastElement(ap.split('.')))){
          console.log(`Bad extension: ${ap}`)
        }else{
          promises.push(
            new Promise(async (res) => {
              try{
                imgSizeBuff = await imageSize(fs.createReadStream(ap.replaceAll('/', '\\')))
                imgStatBuff = fs.statSync(ap)
                allImgPathList.push({
                  imgSize:{w: imgSizeBuff.width, h: imgSizeBuff.height},
                  dataSize: imgStatBuff.size,
                  path: ap
                })
              }catch(err){
                console.log(`Skip load: ${ap.replaceAll('/', '\\')}`)
                console.log(err)
              }finally{
                res()
              }
            })
          )
        }
        
        parallelProcCnt += 1

        if(
          (parallelProcCnt >= ParallelProcLimit) ||
          (parseInt(i) >= (allPathList.length - 1))
        ){
          await Promise.all(promises)

          promises = []
          parallelProcCnt = 0
        }
      }

      res(allImgPathList)
    }catch(err){
      rej(err)
    }
  })
}

module.exports= {
  getImageViewList: getImageViewList
}