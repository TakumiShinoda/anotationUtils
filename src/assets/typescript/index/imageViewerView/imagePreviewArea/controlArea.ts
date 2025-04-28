import { ImagePreviewListItem } from "../../../preloads/index/preload"
import { getLastElement } from "../../../utils"
import { resetPreviewImages } from "./allImgMode"

$(function () {
  $('#imagePreviewControlAreaFilterBtn').on('click', () => {
    let filterInputElement: JQuery<HTMLElement> = $('#imagePreviewControlAreaFilterInput')
    let filteredLoadedImageViewPaths: ImagePreviewListItem[] = []
    let filterStr: string = filterInputElement.val() as string
    let fileNameBuff: string

    if(filterStr == ''){
      filteredLoadedImageViewPaths = window.LoadedImageViewPaths
    }else{
      for(let ivp of window.LoadedImageViewPaths){
        fileNameBuff = getLastElement(ivp.path.split('/'))
  
        if(fileNameBuff.indexOf(filterStr) < 0) continue
  
        filteredLoadedImageViewPaths.push(ivp)
      }
    } 

    resetPreviewImages(filteredLoadedImageViewPaths)
  })
})