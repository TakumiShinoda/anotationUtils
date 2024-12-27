import { getLastElement } from "../../utils"
import { showWarningAlert } from "../alertModal"
import { LoadMode, LoadModeList } from './globals'
import { resetPreviewImages } from "./imagePreviewArea/allImgMode"
import { resetPreviewPathList } from './imagePreviewArea/directoryMode'
import { clearPreviewArea } from "./imagePreviewArea/ImagePreviewArea"

window.IsImgViewImageMouseCover = false
window.IsImgViewPrevNextBtnMouseCover= false
window.ImageViewImagePreviewId = -1
window.LoadedImageViewPaths = []
window.LoadedPathDict = {}
window.IsImgNamePathCopying = false
window.LoadModeState = 'AllImg'
window.ImagePreviewDirModeFilter = {
  filter: '',
  depth: 1
}

function cvtLoadMode(modeStr: string | undefined): LoadMode{
  if(modeStr == undefined) return 'Error'
  else if(LoadModeList.some((v) => (v === modeStr))) return modeStr as LoadMode
  else return 'Error'
}

$(function (){
  $('#openFolderBtn').on('click', async() => {
    let openFolderDir: string | undefined

    try{
      openFolderDir = await window.electronAPI.openFolderDialog('imageViewerOpenFolderDialog')

      if(openFolderDir == undefined) return
      
      $('#openFolderDirInputField').val(openFolderDir)
    }catch(err){
      showWarningAlert(err as string)
    }
  })

  $('#loadFolderBtn').on('click', async(ev) => {
    let loadMode: LoadMode = window.LoadModeState
    let imageViewPathSplitBuff: string[]
    let imageViewDir: string = $('#openFolderDirInputField').val() as string
    let pathDictKeyBuff: string

    if(loadMode == 'Error') return

    clearPreviewArea()
    $('#imagePreviewAreaLoadingArea').css('display', 'flex')

    window.electronAPI.getImageViewList(imageViewDir).then((imageViewPaths) => {
      window.LoadedImageViewPaths = imageViewPaths

      window.LoadedPathDict = {}
      for(let ivp of window.LoadedImageViewPaths){
        imageViewPathSplitBuff = ivp.path.split('/')
        pathDictKeyBuff = imageViewPathSplitBuff.slice(0, imageViewPathSplitBuff.length - 1).join('/')
        
        if(!(pathDictKeyBuff in window.LoadedPathDict)) window.LoadedPathDict[pathDictKeyBuff] = []

        window.LoadedPathDict[pathDictKeyBuff].push({imgName: getLastElement(imageViewPathSplitBuff), imgSize: ivp.imgSize, dataSize: ivp.dataSize})
      }

      if(loadMode == 'AllImg'){
        resetPreviewImages(window.LoadedImageViewPaths)
      }else if(loadMode == 'Directory'){
        resetPreviewPathList()
      }else{
        console.log('undefined LoadMode')
      }
    }).catch((err) => {
      showWarningAlert(`Error:\n${err}`)
    }).finally(() => {
      $('#imagePreviewAreaLoadingArea').css('display', 'none')
    })
  })

  $('#loadModeSelectArea .btn').on('click', (ev: JQuery.ClickEvent) => {
    window.LoadModeState = cvtLoadMode($(ev.currentTarget).attr('loadMode'))

    if(window.LoadModeState == 'AllImg') resetPreviewImages(window.LoadedImageViewPaths)
    else if(window.LoadModeState == 'Directory') resetPreviewPathList()
  })

  $('#imageViewImageSizeSlider').on('input', (ev: JQuery.TriggeredEvent) => {
    $('#imageViewImageSizeInput').val(parseInt(ev.currentTarget.value))
  })

  $('#imageViewImageSizeInput').on('input', (ev: JQuery.TriggeredEvent) => {
    let inputElement: JQuery<HTMLElement> = $(ev.currentTarget)
    let inputValue: number = parseInt(inputElement.val() as string)

    if(isNaN(inputValue) || inputValue <= 0) inputElement.val(1)
    else if(inputValue > 1000) inputElement.val(1000)

    $('#imageViewImageSizeSlider').val(inputValue)
  })
})