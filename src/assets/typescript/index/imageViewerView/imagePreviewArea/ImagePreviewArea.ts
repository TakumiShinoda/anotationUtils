import { toggleUserControl } from "../../index"

export function clearPreviewArea(){
  let previewImagesElement: JQuery<HTMLElement> = $('#imagePreviewArea>.imageViewPreviewImageBackground')
  let pathPreviewTableElement: JQuery<HTMLElement> = $('#pathPreviewTable')
  let pathPreviewAreaElement: JQuery<HTMLElement> = $('#pathPreviewArea')

  previewImagesElement.remove()
  pathPreviewAreaElement.empty()

  pathPreviewTableElement.css('display', 'none')
}

export function togglePreviewAreaLoading(visible: boolean){
  if(visible){
    toggleUserControl(false)
    $('#imagePreviewAreaLoadingArea').css('display', 'flex')
  }else{
    toggleUserControl(true)
    $('#imagePreviewAreaLoadingArea').css('display', 'none')
  }
}

export function resetImagePreviewNaviArea(){
  let imagePreviewNaviArea: JQuery<HTMLElement> = $('#imagePreviewNaviArea')

  for(let ipn of imagePreviewNaviArea.children()){
    $(ipn).css('display', 'none')
  }
}