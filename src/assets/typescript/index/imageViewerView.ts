import { cvtNum2DataSizeStr, getLastElement, showAlertModal } from "../utils"

// const cman = require('../../javascript/cmanObjMove_v091/cmanObjMove_v091.js')
import {cmanOM_JS_init} from '../cmanObjMove_v091'

let IsImgViewMouseCover: boolean = false
let ImageViewImagePreviewId: number = -1

function resetImageViewImage(imgPath: string, imgSize: {w: number, h: number}){
  const ImgViewDefaultMaxSize = 300

  let imgViewSize: {w: number, h: number} = {w: ImgViewDefaultMaxSize, h: ImgViewDefaultMaxSize}

  if(imgSize.w > imgSize.h) imgViewSize.h = imgSize.h * (imgViewSize.w / imgSize.w)
  else imgViewSize.w = imgSize.w * (imgViewSize.h / imgSize.h)

  $('#imageViewArea img').remove()
  $('#imageViewArea').append(`<img class="imageViewImage" src="${imgPath}" width="${imgViewSize.w}px" height="${imgViewSize.h}px" cmanOMat="move" style="scale:1;transform-origin: 0px 0px;z-index: 12;">`)
  cmanOM_JS_init()

  $('.imageViewImage').on({
    'mouseover': function(){
      IsImgViewMouseCover = true
    },
    'mouseout': function(e: JQuery.MouseOutEvent){
      IsImgViewMouseCover = false
    }
  })
}

function turnOverImageView(isNext: boolean = true){
  let imgSize: {w: number, h: number}

  if(isNext){
    if((ImageViewImagePreviewId + 1) >= $('img.imageViewPreviewImage').length) return
    ImageViewImagePreviewId += 1;
  }else{
    if((ImageViewImagePreviewId - 1) < 0) return
    ImageViewImagePreviewId -= 1;
  }

  for(let ivpi of $('img.imageViewPreviewImage')){
    if(parseInt($(ivpi).attr('previewId') as string) != ImageViewImagePreviewId) continue

    imgSize = {
      w: parseInt($(ivpi).attr('imgW') as string),
      h: parseInt($(ivpi).attr('imgh') as string)
    }

    resetImageViewImage($(ivpi).attr('src') as string, imgSize)
  }
}

$(function (){
  $('#openFolderBtn').on('click', async() => {
    let openFolderDir: string | undefined

    try{
      openFolderDir = await (window as any).electronAPI.openFolderDialog()

      if(openFolderDir == undefined) return
      
      $('#openFolderDirInputField').val(openFolderDir)
    }catch(err){
      alert(err)
    }
  })

  $('#loadFolderBtn').on('click', async() => {
    let imageViewDir: string = $('#openFolderDirInputField').val() as string
    let imageViewPaths: {imgSize: {w: number, h: number}, dataSize: number, path: string}[]
    let previewImageSizeBuff: {w: number, h: number}
    let imageNameBuff: string
    let imageViewElementStr: string = ''
    let imagePreviewSize: number

    try{
      $('#imagePreviewArea').empty()

      imagePreviewSize = parseInt($('#imageViewImageSizeSlider').val() as string)
      imageViewPaths = await (window as any).electronAPI.getImageViewList(imageViewDir)

      if(imageViewPaths.length > 10000){
        alert(`${imageViewPaths.length}images found.\nToo much images.`)
        return
      }

      $('#imageCounts').text(imageViewPaths.length.toString())

      imageViewPaths.forEach((ivp: {imgSize: {w: number, h: number}, dataSize: number, path: string}, ivpi) => {
        previewImageSizeBuff = {w: imagePreviewSize, h: imagePreviewSize}
        imageNameBuff = getLastElement(ivp.path.split('/'))

        if(ivp.imgSize.w > ivp.imgSize.h) previewImageSizeBuff.h = ivp.imgSize.h * (imagePreviewSize / ivp.imgSize.w)
        else previewImageSizeBuff.w = ivp.imgSize.w * (imagePreviewSize / ivp.imgSize.h)

        imageViewElementStr += `
          <span class="imageViewPreviewImageBackground" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;">
            <img class="imageViewPreviewImage" src="${ivp.path}" width="${previewImageSizeBuff.w}px" height="${previewImageSizeBuff.h}px" loading="lazy" previewId="${ivpi}">
            <span class="imageViewImageInfoArea" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;" src="${ivp.path}" imgW="${previewImageSizeBuff.w}" imgH="${previewImageSizeBuff.h}" previewId="${ivpi}">
              <span class="imageViewImageInfo" width="100%">${imageNameBuff}</span>
              <span class="imageViewImageInfo" width="100%">${cvtNum2DataSizeStr(ivp.dataSize)}</span>
              <span class="imageViewImageInfo" width="100%">${ivp.imgSize.w} x ${ivp.imgSize.h}</span>
            </span>
          </span>
        `
      })

      $('#imagePreviewArea').append(imageViewElementStr)
      $('.imageViewImageInfoArea').on('click', (ev: JQuery.TriggeredEvent) => {
        let imageViewAreaBackgroundElement: JQuery<HTMLElement> = $('#imageViewAreaBackground')
        let clickedElement: JQuery<HTMLElement> = $(ev.currentTarget)
        let imgPath: string = clickedElement.attr('src') as string
        let imgSize: {w: number, h: number}
    
        imgSize = {
          w: parseInt(clickedElement.attr('imgW') as string),
          h: parseInt(clickedElement.attr('imgh') as string)
        }
        
        resetImageViewImage(imgPath, imgSize)
        ImageViewImagePreviewId = parseInt(clickedElement.attr('previewId') as string)
        
        imageViewAreaBackgroundElement.css({'z-index': '10'})
        imageViewAreaBackgroundElement.css({'opacity': '1'})
      })
    }catch(err){
      alert(`Error:\n${err}`)
    }
  })

  document.addEventListener('wheel', (e: WheelEvent) => {
    const ZoomStep: number = 0.3
    const ImgMaxScale: number = 15
    const ImgMinScale: number = 0.1

    let imgViewImgElement: JQuery<HTMLElement> = $('.imageViewImage')
    let wheelDirection: number
    let postImgScale: number
    let newImgScale: number

    if(
      imgViewImgElement.length == 0 ||
      !IsImgViewMouseCover
    ) return

    postImgScale = parseFloat(imgViewImgElement.css('scale'))

    if(e.deltaY < 0) wheelDirection = 1
    else wheelDirection = -1

    newImgScale = postImgScale + (ZoomStep * wheelDirection)

    if(newImgScale < ImgMinScale) newImgScale = ImgMinScale
    else if(newImgScale > ImgMaxScale) newImgScale = ImgMaxScale

    imgViewImgElement.css('scale', newImgScale.toString())
  })

  $('#imageViewCloseBtn').on('click', (ev: JQuery.TriggeredEvent) => {
    let imageViewAreaBackgroundElement: JQuery<HTMLElement> = $('#imageViewAreaBackground')

    imageViewAreaBackgroundElement.css({'z-index': '-10'})
    imageViewAreaBackgroundElement.css({'opacity': '0'})
  })

  $('#imageViewPrevBtn').on('click', (ev: JQuery.TriggeredEvent) => {
    turnOverImageView(false)
  })

  $('#imageViewNextBtn').on('click', (ev: JQuery.TriggeredEvent) => {
    turnOverImageView(true)
  })

  document.addEventListener('keydown', (ev: KeyboardEvent) => {
    if(ImageViewImagePreviewId != -1){
      if(ev.key == 'ArrowRight') turnOverImageView(true)
      else if(ev.key == 'ArrowLeft') turnOverImageView(false)
    }
  })

  $('#imageViewImageSizeSlider').on('input', (ev: JQuery.TriggeredEvent) => {
    let imageInfoAreaElementBuff: JQuery<HTMLElement>
    let imageElementBuff: JQuery<HTMLElement>
    let previewImageSizeBuff: {w: number, h: number}
    let currentImageSizeBuff: {w: number, h: number}
    let imageSize: number = parseInt(ev.currentTarget.value)

    $('#imageViewImageSize').text(imageSize)

    for(let imageBackgroundElement of $('#imagePreviewArea').children()){
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