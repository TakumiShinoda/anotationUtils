import { cvtNum2DataSizeStr, getLastElement, showAlertModal } from "../utils"

import {cmanOM_JS_init} from '../cmanObjMove_v091'
import { ImagePreviewListItem } from "../preload"

let IsImgViewImageMouseCover: boolean = false
let IsImgViewPrevNextBtnMouseCover: boolean = false
let ImageViewImagePreviewId: number = -1
let LoadedImageViewPaths: ImagePreviewListItem[] = []
let LoadedPathDict: {[key: string]: {imgName: string, imgSize: {w: number, h: number}, dataSize: number}[]} = {}

const LoadModeList = ['Error', 'AllImg', 'Directory'] as const
type LoadMode = (typeof LoadModeList)[number]

function resetImageViewImage(imgPath: string, imgSize: {w: number, h: number}){
  const ImgViewDefaultMaxSize = 300

  let imgViewSize: {w: number, h: number} = {w: ImgViewDefaultMaxSize, h: ImgViewDefaultMaxSize}

  if(imgSize.w > imgSize.h) imgViewSize.h = imgSize.h * (imgViewSize.w / imgSize.w)
  else imgViewSize.w = imgSize.w * (imgViewSize.h / imgSize.h)

  $('#imageViewArea #cmanOM_ID_DMY0').remove()
  $('#imageViewArea').append(`<img class="imageViewImage" src="${imgPath}" width="${imgViewSize.w}px" height="${imgViewSize.h}px" cmanOMat="move" style="scale:1;transform-origin: 0px 0px;z-index: 12;">`)
  cmanOM_JS_init()

  $('.imageViewImage').on({
    'mouseover': function(){
      IsImgViewImageMouseCover = true
    },
    'mouseout': function(e: JQuery.MouseOutEvent){
      IsImgViewImageMouseCover = false
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

function cvtLoadMode(modeStr: string | undefined): LoadMode{
  if(modeStr == undefined) return 'Error'
  else if(LoadModeList.some((v) => (v === modeStr))) return modeStr as LoadMode
  else return 'Error'
}

function getLoadMode(): LoadMode{
  return cvtLoadMode($('#loadModeSelectArea .active').attr('loadMode'))
}

function resetImagePreviewNaviArea(){
  let imagePreviewNaviArea: JQuery<HTMLElement> = $('#imagePreviewNaviArea')

  for(let ipn of imagePreviewNaviArea.children()){
    $(ipn).css('display', 'none')
  }
}

function resetPreviewImages(imageViewPaths: ImagePreviewListItem[]){
  let previewImageSizeBuff: {w: number, h: number}
  let imageNameBuff: string
  let imageViewElementStr: string = ''
  let imagePreviewSize: number

  imagePreviewSize = parseInt($('#imageViewImageSizeSlider').val() as string)

  resetImagePreviewNaviArea()
  $('#imagePreviewArea').empty()
  $('#imageCounts').text(imageViewPaths.length.toString())
  
  imageViewPaths.forEach((ivp: ImagePreviewListItem, ivpi) => {
    previewImageSizeBuff = {w: imagePreviewSize, h: imagePreviewSize}
    imageNameBuff = getLastElement(ivp.path.split('/'))

    if(ivp.imgSize.w > ivp.imgSize.h) previewImageSizeBuff.h = ivp.imgSize.h * (imagePreviewSize / ivp.imgSize.w)
    else previewImageSizeBuff.w = ivp.imgSize.w * (imagePreviewSize / ivp.imgSize.h)

    imageViewElementStr += `
      <span class="imageViewPreviewImageBackground" style="width:${imagePreviewSize}px;height:${imagePreviewSize}px;">
        <img class="imageViewPreviewImage" src="${ivp.path}" width="${previewImageSizeBuff.w}px" height="${previewImageSizeBuff.h}px" loading="lazy" previewId="${ivpi}" imgW="${previewImageSizeBuff.w}" imgH="${previewImageSizeBuff.h}">
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

  $('#previewAreaPager').css('display', 'block')
}

function resetPreviewPathList(){
  let imageViewElementStr: string = ''
  let allImageCount: number = 0

  resetImagePreviewNaviArea()
  $('#imagePreviewArea').empty()

  imageViewElementStr += `
    <table class='table table-dark table-hover table-borderless' style='display: flex; margin: 0px; flex-direction: column;'>
      <thead class='sticky-top bg-primary' style='border-radius: 0px;'>
        <tr style='display: flex;'>
          <th style='display: flex; justify-content: left; align-items: center; width: 100%; padding: 3px;'>
            <div style='display: flex; align-items: center; margin: 0px 3px;'>
              <div>Filter：</div>
              <input class='form-control' type='text' style='width:240px; height: 30px;'>
            </div>
            <div style='display: flex; align-items: center; margin: 0px 3px;'>
              <div>Filter Depth：</div>
              <input class='form-control' type='number' style='width:50px; height: 30px;' step='1'>
            </div>
            <div class='btn btn-success' style='display: flex; margin: 0px 3px;'>Filter<div>
          </th>
        </tr>
      </thead>
      <tbody style='display: flex; flex-direction: column; width: 100%;'>
  `

  for(let key of Object.keys(LoadedPathDict)){
    imageViewElementStr += `
      <tr class='pathPreviewListItem' style='display: flex; width: 100%; padding: 0px;' path='${key}'>
        <td style='display: flex; width: 100%; padding: 0px;'>
          <button type="button" class='list-group-item list-group-item-success list-group-item-action btn'>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>
                ${key}
              </div>
              <div>
                ${LoadedPathDict[key].length}images
              </div>
            </div>
          </button>
        </td>
      </tr>
    `

    allImageCount += LoadedPathDict[key].length
  }

  imageViewElementStr += `</tbody></table>`

  $('#imagePreviewArea').append(imageViewElementStr)
  $('#imageCounts').text(allImageCount.toString())
  $('.pathPreviewListItem').on('click', (ev: JQuery.ClickEvent) => {
    let path: string = $(ev.currentTarget).attr('path') as string
    let previewList: ImagePreviewListItem[] = []

    if(LoadedPathDict[path].length > 10000){
      alert(`${LoadedPathDict[path].length}images found.\nToo much images.`)
      return
    }

    for(let lpd of LoadedPathDict[path]){
      previewList.push({
        imgSize: lpd.imgSize, 
        dataSize: lpd.dataSize, 
        path: `${path}/${lpd.imgName}`
      })
    }

    resetPreviewImages(previewList)
    resetImagePreviewNaviArea()
    $('#backToPathListBtn').css('display', 'block')
    $('#imagePreviewAreaLoadingArea').css('display', 'none')
  })
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
    let loadMode: LoadMode = getLoadMode()
    let imageViewPathSplitBuff: string[]
    let imageViewDir: string = $('#openFolderDirInputField').val() as string
    let pathDictKeyBuff: string

    if(loadMode == 'Error') return

    $('#imagePreviewArea').empty()
    $('#imagePreviewAreaLoadingArea').css('display', 'flex')

    window.electronAPI.getImageViewList(imageViewDir).then((imageViewPaths) => {
      LoadedImageViewPaths = imageViewPaths

      LoadedPathDict = {}
      for(let ivp of LoadedImageViewPaths){
        imageViewPathSplitBuff = ivp.path.split('/')
        pathDictKeyBuff = imageViewPathSplitBuff.slice(0, imageViewPathSplitBuff.length - 1).join('/')
        
        if(!(pathDictKeyBuff in LoadedPathDict)) LoadedPathDict[pathDictKeyBuff] = []

        LoadedPathDict[pathDictKeyBuff].push({imgName: getLastElement(imageViewPathSplitBuff), imgSize: ivp.imgSize, dataSize: ivp.dataSize})
      }

      if(loadMode == 'AllImg'){
        if(LoadedImageViewPaths.length > 10000){
          alert(`${LoadedImageViewPaths.length}images found.\nToo much images.`)
          return
        }

        resetPreviewImages(LoadedImageViewPaths)
      }else if(loadMode == 'Directory'){
        resetPreviewPathList()
      }else{
        console.log('undefined LoadMode')
      }
    }).catch((err) => {
      alert(`Error:\n${err}`)
    }).finally(() => {
      $('#imagePreviewAreaLoadingArea').css('display', 'none')
    })
  })

  $('#backToPathListBtn').on('click', (ev: JQuery.ClickEvent) => {
    resetPreviewPathList()
    $('#previewAreaPager').css('display', 'none')
    $('#backToPathListBtn').css('display', 'none')
  })

  $('#loadModeSelectArea .btn').on('click', (ev: JQuery.ClickEvent) => {
    let loadMode: LoadMode = cvtLoadMode($(ev.currentTarget).attr('loadMode'))

    if(loadMode == 'AllImg') resetPreviewImages(LoadedImageViewPaths)
    else if(loadMode == 'Directory') resetPreviewPathList()
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
      !IsImgViewImageMouseCover
    ) return

    postImgScale = parseFloat(imgViewImgElement.css('scale'))

    if(e.deltaY < 0) wheelDirection = 1
    else wheelDirection = -1

    newImgScale = postImgScale + (ZoomStep * wheelDirection)

    if(newImgScale < ImgMinScale) newImgScale = ImgMinScale
    else if(newImgScale > ImgMaxScale) newImgScale = ImgMaxScale

    imgViewImgElement.css('scale', newImgScale.toString())
  })

  $('#imageViewCloseBtn,#imageViewArea').on('click', (ev: JQuery.TriggeredEvent) => {
    let imageViewAreaBackgroundElement: JQuery<HTMLElement> = $('#imageViewAreaBackground')

    if(IsImgViewImageMouseCover || IsImgViewPrevNextBtnMouseCover) return

    imageViewAreaBackgroundElement.css({'z-index': '-10'})
    imageViewAreaBackgroundElement.css({'opacity': '0'})
  })
  
  $('#imageViewPrevBtn,#imageViewNextBtn').on({
    'mouseover': function(){
      IsImgViewPrevNextBtnMouseCover = true
    },
    'mouseout': function(){
      IsImgViewPrevNextBtnMouseCover = false
    }
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