import { cvtNum2DataSizeStr, getLastElement, showAlertModal } from "../utils"

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
    let imageNameBuff: string
    let imageViewElementStr: string = ''
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

        imageViewElementStr += `
          <span class="imageViewPreviewImageBackground" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;">
            <img class="imageViewImage" src="${ivp.path}" width="${previewImageSizeBuff.w}px" height="${previewImageSizeBuff.h}px" loading="lazy">
            <span class="imageViewImageInfoArea" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;">
              <span class="imageViewImageInfo" width="100%">${imageNameBuff}</span>
              <span class="imageViewImageInfo" width="100%">${cvtNum2DataSizeStr(ivp.dataSize)}</span>
              <span class="imageViewImageInfo" width="100%">${ivp.imgSize.w} x ${ivp.imgSize.h}</span>
            </span>
          </span>
        `
      }

      $('#imageViewArea').append(imageViewElementStr)
    }catch(err){
      alert(`Error:\n${err}`)
    }
  })

  $('#imageViewImageSizeSlider').on('input', (ev: JQuery.TriggeredEvent) => {
    let imageInfoAreaElementBuff: JQuery<HTMLElement>
    let imageElementBuff: JQuery<HTMLElement>
    let previewImageSizeBuff: {w: number, h: number}
    let currentImageSizeBuff: {w: number, h: number}
    let imageSize: number = parseInt(ev.currentTarget.value)

    $('#imageViewImageSize').text(imageSize)

    for(let imageBackgroundElement of $('#imageViewArea').children()){
      $(imageBackgroundElement).width(imageSize)
      $(imageBackgroundElement).height(imageSize)
    }

    for(let iiae of $('.imageViewImageInfoArea')){
      imageInfoAreaElementBuff = $(iiae)

      imageInfoAreaElementBuff.width(imageSize)
      imageInfoAreaElementBuff.height(imageSize)
    }

    for(let ie of $('.imageViewImage')){
      imageElementBuff = $(ie)
      previewImageSizeBuff = {w: imageSize, h: imageSize}
      currentImageSizeBuff = {
        w: imageElementBuff.width() as number,
        h: imageElementBuff.height() as number
      }

      if(currentImageSizeBuff.w > currentImageSizeBuff.h) previewImageSizeBuff.h = currentImageSizeBuff.h * (imageSize / currentImageSizeBuff.w)
      else previewImageSizeBuff.w = currentImageSizeBuff.w * (imageSize / currentImageSizeBuff.h)

      imageElementBuff.width(previewImageSizeBuff.w)
      imageElementBuff.height(previewImageSizeBuff.h)
    }
  })
})