import { ImagePreviewListItem } from "../../../preloads/index/preload"
import { getLastElement } from "../../../utils"
import { resetPreviewImages } from "./allImgMode"

$(function () {
  $('#imagePreviewControlAreaFilterBtn').on('click', () => {
    let filterInputElement: JQuery<HTMLElement> = $('#imagePreviewControlAreaFilterInput')
    let filteredLoadedImageViewPaths: ImagePreviewListItem[] = []
    let filterStr: string = filterInputElement.val() as string
    let fileNameBuff: string

    if(window.LoadModeState == 'AllImg'){
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
    }else if(window.LoadModeState == 'Directory'){
      if(filterStr == ''){
        filteredLoadedImageViewPaths = window.DirModeCurrentPreviewList
      }else{
        for(let ivp of window.DirModeCurrentPreviewList){
          fileNameBuff = getLastElement(ivp.path.split('/'))
    
          if(fileNameBuff.indexOf(filterStr) < 0) continue
    
          filteredLoadedImageViewPaths.push(ivp)
        }
      } 
  
      resetPreviewImages(filteredLoadedImageViewPaths)
    }
  })
})