import { cvtNum2DataSizeStr, getLastElement } from "../utils"

$(function (){
  $('#openFolderBtn').on('click', async() => {
    let openFolderDir: string

    openFolderDir = await (window as any).electronAPI.openFolderDialog()
    $('#openFolderDirInputField').val(openFolderDir)
  })

  $('#loadFolderBtn').on('click', async() => {
    let imageViewDir: string = $('#openFolderDirInputField').val() as string
    let imageViewPaths: {imgSize: {w: number, h: number}, dataSize: number, path: string}[]
    let previewImageSizeBuff: {w: number, h: number}
    let imageElementBuff: string
    let imageNameBuff: string
    let imagePreviewSize: number

    try{
      $('#imageViewArea').empty()

      imagePreviewSize = parseInt($('#imageViewImageSizeSlider').val() as string)
      imageViewPaths = await (window as any).electronAPI.getImageViewList(imageViewDir)

      if(imageViewPaths.length > 10000){
        alert(`${imageViewPaths.length}images found.\nToo much images.`)
        return
      }

      $('#imageCounts').text(imageViewPaths.length.toString())

      for(let ivp of imageViewPaths){
        previewImageSizeBuff = {w: imagePreviewSize, h: imagePreviewSize}
        imageNameBuff = getLastElement(ivp.path.split('/'))

        if(ivp.imgSize.w > ivp.imgSize.h) previewImageSizeBuff.h = ivp.imgSize.h * (imagePreviewSize / ivp.imgSize.w)
        else previewImageSizeBuff.w = ivp.imgSize.w * (imagePreviewSize / ivp.imgSize.h)

        imageElementBuff = `
          <span class="imageViewPreviewImageBackground" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;">
            <img class="imageViewImage" src="${ivp.path}" width="${previewImageSizeBuff.w}px" height="${previewImageSizeBuff.h}px">
            <span class="imageViewImageInfoArea" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;">
              <span class="imageViewImageInfo" width="100%">${imageNameBuff}</span>
              <span class="imageViewImageInfo" width="100%">${cvtNum2DataSizeStr(ivp.dataSize)}</span>
              <span class="imageViewImageInfo" width="100%">${ivp.imgSize.w} x ${ivp.imgSize.h}</span>
            </span>
          </span>
        `

        $('#imageViewArea').append(imageElementBuff)
      }
    }catch(err){
      alert('error')
    }
  })

  $('#imageViewImageSizeSlider').on('input', (ev: JQuery.TriggeredEvent) => {
    let imageSize: number = parseInt(ev.currentTarget.value)
    let previewImageSizeBuff: {w: number, h: number}
    let currentImageSizeBuff: {w: number, h: number}

    $('#imageViewImageSize').text(imageSize)

    for(let imageBackgroundElement of $('#imageViewArea').children()){
      $(imageBackgroundElement).width(imageSize)
      $(imageBackgroundElement).height(imageSize)
    }

    for(let imageInfoElement of $('.imageViewImageInfoArea')){
      $(imageInfoElement).width(imageSize)
      $(imageInfoElement).height(imageSize)
    }

    for(let imageElement of $('.imageViewImage')){
      previewImageSizeBuff = {w: imageSize, h: imageSize}
      currentImageSizeBuff = {
        w: $(imageElement).width() as number,
        h: $(imageElement).height() as number
      }

      if(currentImageSizeBuff.w > currentImageSizeBuff.h) previewImageSizeBuff.h = currentImageSizeBuff.h * (imageSize / currentImageSizeBuff.w)
      else previewImageSizeBuff.w = currentImageSizeBuff.w * (imageSize / currentImageSizeBuff.h)

      $(imageElement).width(previewImageSizeBuff.w)
      $(imageElement).height(previewImageSizeBuff.h)
    }
  })
})