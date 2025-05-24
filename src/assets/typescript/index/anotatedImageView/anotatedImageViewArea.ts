import { AnotatedImgInfo } from "../../preloads/index/preload"
import { closeAllArea } from "./anotatedImageView"
import { resetSelectDatabaseList } from "./selectDatabaseListArea"

export function resetAnotatedImageViewArea(anotatedImgInfos: AnotatedImgInfo[]){
  let contentsAreaElement: JQuery<HTMLElement> = $('#anotatedImageViewAreaContentsArea')
  let newItemElementBuff: JQuery<HTMLElement>
  let imgItemElementBuff: JQuery<HTMLElement>
  let imageItemElementStrBuff: string

  contentsAreaElement.empty()

  for(let aii of anotatedImgInfos){
    for(let adk in aii.anotateData){
      for(let ad of aii.anotateData[adk]){
        imageItemElementStrBuff = /*html*/`
          <div class='anotatedImageViewAreaImageBackground'>
            <img class='anotatedImageViewAreaImage' src='${aii.path}'>
            <div class='anotatedImageViewAreaImageInfo'>${adk}</div>
            <div class='anotatedImageViewAreaImageStatusArea'>
              <div class="anotatedImageViewAreaImageSelectedIcon bi bi-check-square icon selected" selected></div>
            </div>
          </div>
        `
        newItemElementBuff = $(imageItemElementStrBuff)
        imgItemElementBuff = newItemElementBuff.children('img')

        newItemElementBuff.on('click', (ev: JQuery.ClickEvent) => {
          let selectedIconElement: JQuery<HTMLElement> = $(ev.currentTarget).find('.anotatedImageViewAreaImageSelectedIcon')
          let isSelected: boolean = selectedIconElement.prop('selected')

          if(window.AnotatedImageViewIsSelectMode){
            selectedIconElement.prop('selected', !isSelected)

            if(isSelected) selectedIconElement.css('visibility', 'hidden')
            else selectedIconElement.css('visibility', 'visible')
          }else{
          }
        })

        imgItemElementBuff.on('load', (ev: JQuery.TriggeredEvent) => {
          let loadedImgItemElementBuff: HTMLImageElement = $(ev.currentTarget)[0]

          $(ev.currentTarget).css('object-view-box', `inset(${ad.y1}px ${loadedImgItemElementBuff.naturalWidth - ad.x2}px ${loadedImgItemElementBuff.naturalHeight - ad.y2}px ${ad.x1}px)`)
        })
        contentsAreaElement.append(newItemElementBuff)
      }
    }
  }
}

$(function (){
  $('#anotatedImageViewAreaSelectAllBtn').on('click', () => {
    let selectedIconElements: JQuery<HTMLElement> = $('.anotatedImageViewAreaImageSelectedIcon')

    selectedIconElements.prop('selected', true)
    selectedIconElements.css('visibility', 'visible')
  })

  $('#anotatedImageViewAreaClearSelectBtn').on('click', () => {
    let selectedIconElements: JQuery<HTMLElement> = $('.anotatedImageViewAreaImageSelectedIcon')

    selectedIconElements.prop('selected', false)
    selectedIconElements.css('visibility', 'hidden')
  })

  $('#anotatedImageViewAreaSelectModeBtn').on('click', (ev: JQuery.ClickEvent) => {
    let selectModeBtnAreaElement: JQuery<HTMLElement> = $('#anotatedImageViewAreaSelectModeBtnArea')

    if($(ev.currentTarget).prop('checked')){
      window.AnotatedImageViewIsSelectMode = true
      selectModeBtnAreaElement.css('visibility', 'visible')
    }else{
      window.AnotatedImageViewIsSelectMode = false
      selectModeBtnAreaElement.css('visibility', 'hidden')
    }
  })

  $('#anotatedImageViewAreaBackBtn').on('click', async () => {
    closeAllArea()
    await resetSelectDatabaseList()
    $('#selectDatabaseListArea').css('display', 'block')
  })
})