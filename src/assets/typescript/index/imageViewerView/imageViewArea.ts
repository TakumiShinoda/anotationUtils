import { getLastElement, wait } from "../../utils"
import {cmanOM_JS_init} from '../../cmanObjMove_v091'
import './globals'
import './imageViewControlArea'

export function resetImageViewImage(imgPath: string, imgSize: {w: number, h: number}){
  const MaxViewSizeOffset = 35

  let viewAreaElement: JQuery<Element> = $('#imageViewArea')
  let imgViewDefaultMaxSize: number = parseInt($('#imageViewControlAreaViewSizeInput').val() as string)
  let imgViewSize: {w: number, h: number} = {w: imgViewDefaultMaxSize, h: imgViewDefaultMaxSize}
  let viewAreaSize: {w: number, h: number} = {w: viewAreaElement.width() as number, h: viewAreaElement.height() as number}

  viewAreaSize.w -= MaxViewSizeOffset * 2
  viewAreaSize.h -= MaxViewSizeOffset * 2

  if(imgSize.w > imgSize.h){
    if(imgViewSize.w > viewAreaSize.w) imgViewSize = {w: viewAreaSize.w, h: viewAreaSize.w}

    imgViewSize.h = imgSize.h * (imgViewSize.w / imgSize.w)

    if((viewAreaSize.h - imgViewSize.h) < (MaxViewSizeOffset * 2)){
      imgViewSize.w = imgViewSize.w * (viewAreaSize.h  / imgViewSize.h)
      imgViewSize.h = viewAreaSize.h
    }
  }else{
    if(imgViewSize.h > viewAreaSize.h) imgViewSize = {w: viewAreaSize.h, h: viewAreaSize.h}

    imgViewSize.w = imgSize.w * (imgViewSize.h / imgSize.h)

    if((viewAreaSize.w - imgViewSize.w) < (MaxViewSizeOffset * 2)){
      imgViewSize.h = imgViewSize.h * (viewAreaSize.w / imgViewSize.w)
      imgViewSize.w = viewAreaSize.w
    }
  }

  $('#imageViewControlAreaImagePath').val(getLastElement(imgPath.split('/')))
  $('#imageViewControlAreaImagePath').attr('fullPath', imgPath)
  $('#imageViewArea #cmanOM_ID_DMY0').remove()
  $('#imageViewArea').append(`<img class="imageViewImage" src="${imgPath}" width="${imgViewSize.w}px" height="${imgViewSize.h}px" cmanOMat="move" style="scale:1;transform-origin: 0px 0px;z-index: 12;">`)
  cmanOM_JS_init()

  $('.imageViewImage').on({
    'mouseover': function(){
      window.IsImgViewImageMouseCover = true
    },
    'mouseout': function(e: JQuery.MouseOutEvent){
      window.IsImgViewImageMouseCover = false
    }
  })
}

export function turnPageImageView(turnPage: number){
  let imgSize: {w: number, h: number}
  let newPage: number = window.ImageViewImagePreviewId + turnPage

  if(
    (newPage >= $('img.imageViewPreviewImage').length) ||
    (newPage < 0) 
  ) return

  window.ImageViewImagePreviewId = newPage

  for(let ivpi of $('img.imageViewPreviewImage')){
    if(parseInt($(ivpi).attr('previewId') as string) != window.ImageViewImagePreviewId) continue

    imgSize = {
      w: parseInt($(ivpi).attr('imgW') as string),
      h: parseInt($(ivpi).attr('imgh') as string)
    }

    resetImageViewImage($(ivpi).attr('src') as string, imgSize)
  }
}

$(function (){
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
      !window.IsImgViewImageMouseCover
    ) return

    postImgScale = parseFloat(imgViewImgElement.css('scale'))

    if(e.deltaY < 0) wheelDirection = 1
    else wheelDirection = -1

    newImgScale = postImgScale + (ZoomStep * wheelDirection)

    if(newImgScale < ImgMinScale) newImgScale = ImgMinScale
    else if(newImgScale > ImgMaxScale) newImgScale = ImgMaxScale

    imgViewImgElement.css('scale', newImgScale.toString())
  })

  document.addEventListener('keydown', (ev: KeyboardEvent) => {
    if(window.ImageViewImagePreviewId != -1){
      if(ev.key == 'ArrowRight') turnPageImageView(1)
      else if(ev.key == 'ArrowLeft') turnPageImageView(-1)
    }
  })

  $('#imageViewCloseBtn,#imageViewArea').on('click', async () => {
    let imageViewAreaBackgroundElement: JQuery<HTMLElement> = $('#imageViewAreaBackground')

    if(window.IsImgViewImageMouseCover || window.IsImgViewPrevNextBtnMouseCover) return

    imageViewAreaBackgroundElement.css({'opacity': '0'})
    await wait(300)
    imageViewAreaBackgroundElement.css({'z-index': '-10'})
  })

  $('#imageViewPrevBtn,#imageViewNextBtn').on({
    'mouseover': function(){
      window.IsImgViewPrevNextBtnMouseCover = true
    },
    'mouseout': function(){
      window.IsImgViewPrevNextBtnMouseCover = false
    }
  })

  $('#imageViewPrevBtn').on('click', () => {
    turnPageImageView(-1)
  })

  $('#imageViewNextBtn').on('click', () => {
    turnPageImageView(1)
  })
})