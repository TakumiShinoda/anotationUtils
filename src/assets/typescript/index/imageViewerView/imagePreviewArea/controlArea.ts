import { ImagePreviewListItem } from "../../../preloads/index/preload"
import { getLastElement } from "../../../utils"
import { resetPreviewImages } from "./allImgMode"

$(function () {
  $('#imagePreviewControlAreaFilterBtn').on('click', () => {
    let filterInputElement: JQuery<HTMLElement> = $('#imagePreviewControlAreaFilterInput')
    let targetImagePreviewList: ImagePreviewListItem[]
    let filteredLoadedImageViewPaths: ImagePreviewListItem[] = []
    let filterStr: string = filterInputElement.val() as string
    let fileNameBuff: string

    if(window.LoadModeState == 'AllImg') targetImagePreviewList = window.LoadedImageViewPaths
    else if(window.LoadModeState == 'Directory') targetImagePreviewList = window.DirModeCurrentPreviewList
    else return

    if(filterStr == '') filteredLoadedImageViewPaths = targetImagePreviewList
    else{
      for(let ivp of targetImagePreviewList){
        fileNameBuff = getLastElement(ivp.path.split('/'))
  
        if(fileNameBuff.indexOf(filterStr) < 0) continue
  
        filteredLoadedImageViewPaths.push(ivp)
      }
    } 

    resetPreviewImages(filteredLoadedImageViewPaths)
  })
})