import { cvtNum2DataSizeStr, getLastElement } from "../../../utils"
import { resetImageViewImage } from "../imageViewArea"
import { ImagePreviewListItem } from "../../../preload"
import { clearPreviewArea, resetImagePreviewNaviArea } from "./ImagePreviewArea"

export function resetPreviewImages(imageViewPaths: ImagePreviewListItem[], page: number = 1){
  let slicedImageViewPaths: ImagePreviewListItem[]
  let previewImageSizeBuff: {w: number, h: number}
  let imageNameBuff: string
  let imageViewElementStr: string = ''
  let previewAreaPagerElementStr: string = ''
  let imagePreviewSize: number
  let maxPreviewCount: number
  let pageCount: number
  let pageStartIndex: number

  imagePreviewSize = parseInt($('#imageViewImageSizeSlider').val() as string)
  maxPreviewCount = parseInt($('#imageViewMaxPreviewImagesInput').val() as string)
  pageCount = Math.ceil(imageViewPaths.length / maxPreviewCount)

  resetImagePreviewNaviArea()
  clearPreviewArea()
  $('#imageCounts').text(imageViewPaths.length.toString())

  if((page <= 0) || (page > pageCount)) return

  pageStartIndex = (page - 1) * maxPreviewCount

  if(pageStartIndex + maxPreviewCount > imageViewPaths.length) slicedImageViewPaths = imageViewPaths.slice(pageStartIndex)
  else slicedImageViewPaths = imageViewPaths.slice(pageStartIndex, pageStartIndex + maxPreviewCount)

  previewAreaPagerElementStr += `
    <div style="display: flex;">
      <div class="previewPagerSelector" previewPage="-4">≪&nbsp;</div>
      <div class="previewPagerSelector" previewPage="-3"><&nbsp;</div>
  `

  if(pageCount <= 3){
    for(let i = 0; i < pageCount; i++){
      if((i + 1) == page){
        previewAreaPagerElementStr += `
          <div class="previewPagerSelector previewPagerSelectorSelected" previewPage="${i + 1}">${i + 1}&nbsp;</div>
        `
      }else{
        previewAreaPagerElementStr += `
          <div class="previewPagerSelector" previewPage="${i + 1}">${i + 1}&nbsp;</div>
        `
      }
    }
  }else if(pageCount > 3){
    if(page < 3){
      for(let i = 0; i < 3; i++){
        if((i + 1) == page){
          previewAreaPagerElementStr += `
            <div class="previewPagerSelector previewPagerSelectorSelected" previewPage="${i + 1}">${i + 1}&nbsp;</div>
          `
        }else{
          previewAreaPagerElementStr += `
            <div class="previewPagerSelector" previewPage="${i + 1}">${i + 1}&nbsp;</div>
          `
        }
        
      }

      previewAreaPagerElementStr += `
        <div>...&nbsp;</div>
        <div class="previewPagerSelector" previewPage="${pageCount}">${pageCount}&nbsp;</div>
      `
    }else if (page > (pageCount - (3 - 1))){
      previewAreaPagerElementStr += `
        <div class="previewPagerSelector" previewPage="1">1&nbsp;</div>
        <div>...&nbsp;</div>
      `

      for(let i = 0; i < 3; i++){
        if((i + 1) + (pageCount - 3) == page){
          previewAreaPagerElementStr += `
            <div class="previewPagerSelector previewPagerSelectorSelected" previewPage="${(i + 1) + (pageCount - 3)}">${(i + 1) + (pageCount - 3)}&nbsp;</div>
          `
        }else{
          previewAreaPagerElementStr += `
            <div class="previewPagerSelector" previewPage="${(i + 1) + (pageCount - 3)}">${(i + 1) + (pageCount - 3)}&nbsp;</div>
          `
        }
      }
    }else{
      previewAreaPagerElementStr += `
        <div class="previewPagerSelector" previewPage="1">1&nbsp;</div>
        <div>...&nbsp;</div>
        <div class="previewPagerSelector" previewPage="${page - 1}">${page - 1}&nbsp;</div>
        <div class="previewPagerSelector previewPagerSelectorSelected" previewPage="${page}">${page}&nbsp;</div>
        <div class="previewPagerSelector" previewPage="${page + 1}">${page + 1}&nbsp;</div>
        <div>...&nbsp;</div>
        <div class="previewPagerSelector" previewPage="${pageCount}">${pageCount}&nbsp;</div>
      `
    }
  }

  previewAreaPagerElementStr += `
      <div class="previewPagerSelector" previewPage="-2">>&nbsp;</div>
      <div class="previewPagerSelector" previewPage="-1">≫</div>
    </div>
  `

  $('#previewAreaPager').empty()
  $('#previewAreaPager').append(previewAreaPagerElementStr)
  $('.previewPagerSelector').on('click', (ev: JQuery.ClickEvent) => {
    let previewPage: number = parseInt($(ev.currentTarget).attr('previewPage') as string)

    if(previewPage == -1) resetPreviewImages(imageViewPaths, pageCount)
    else if(previewPage == -2) resetPreviewImages(imageViewPaths, (page == pageCount) ? page : (page + 1))
    else if(previewPage == -3) resetPreviewImages(imageViewPaths, ((page == 1) ? 1 : (page - 1)))
    else if(previewPage == -4) resetPreviewImages(imageViewPaths, 1)
    else if(previewPage > 0) resetPreviewImages(imageViewPaths, previewPage)
  })
  
  slicedImageViewPaths.forEach((ivp: ImagePreviewListItem, ivpi) => {
    previewImageSizeBuff = {w: imagePreviewSize, h: imagePreviewSize}
    imageNameBuff = getLastElement(ivp.path.split('/'))

    if(imageNameBuff.length > (imagePreviewSize / 10)) imageNameBuff = `...${imageNameBuff.slice(-1 * (imagePreviewSize / 10))}`

    if(ivp.imgSize.w > ivp.imgSize.h) previewImageSizeBuff.h = ivp.imgSize.h * (imagePreviewSize / ivp.imgSize.w)
    else previewImageSizeBuff.w = ivp.imgSize.w * (imagePreviewSize / ivp.imgSize.h)

    imageViewElementStr += `
      <span class="imageViewPreviewImageBackground" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;">
        <img class="imageViewPreviewImage" src="${ivp.path}" width="${previewImageSizeBuff.w}px" height="${previewImageSizeBuff.h}px" loading="lazy" previewId="${ivpi}" imgW="${previewImageSizeBuff.w}" imgH="${previewImageSizeBuff.h}">
        <div class="imageViewImageInfoArea" style="width:${imagePreviewSize}px; height:${imagePreviewSize}px;" src="${ivp.path}" imgW="${previewImageSizeBuff.w}" imgH="${previewImageSizeBuff.h}" previewId="${ivpi}">
          <span class="imageViewImageInfo imageViewImageInfoName" width="100%">${imageNameBuff}</span>
          <span class="imageViewImageInfo" width="100%">${cvtNum2DataSizeStr(ivp.dataSize)}</span>
          <span class="imageViewImageInfo" width="100%">${ivp.imgSize.w} x ${ivp.imgSize.h}</span>
        </div>
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
    window.ImageViewImagePreviewId = parseInt(clickedElement.attr('previewId') as string)
    
    imageViewAreaBackgroundElement.css({'z-index': '10'})
    imageViewAreaBackgroundElement.css({'opacity': '1'})
  })

  $('#previewAreaPager').css('display', 'block')
}