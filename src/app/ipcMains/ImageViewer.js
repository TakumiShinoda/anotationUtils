const fs = require('fs')
const imageSize = require('image-size')

const { getAllFilesRecursive, getLastElement } = require('../utils')

function getImageViewList(_, imageViewDir){
  return new Promise((res, rej) => {
    let imgStatBuff
    let allPathList
    let allImgPathList = []
    let imgSizeBuff

    try{
      allPathList = getAllFilesRecursive(imageViewDir)
      
      for(ap of allPathList){
        if(!['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(getLastElement(ap.split('.')))) continue

        try{
          imgSizeBuff = imageSize.imageSize(ap)
          imgStatBuff = fs.statSync(ap)
          allImgPathList.push({
            imgSize:{w: imgSizeBuff.width, h: imgSizeBuff.height},
            dataSize: imgStatBuff.size,
            path: ap
          })
        }catch{
          console.log('err')
          continue
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