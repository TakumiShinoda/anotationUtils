import { AnotatedImgInfo } from "../../preloads/index/preload"
import { closeAllArea } from "./anotatedImageView"
import { resetSelectDatabaseList } from "./selectDatabaseListArea"

export function resetAnotatedImageViewArea(anotatedImgInfos: AnotatedImgInfo[]){
  let contentsAreaElement: JQuery<HTMLElement> = $('#anotatedImageViewAreaContentsArea')
  let newItemElementBuff: JQuery<HTMLElement>
  let imgItemElementBuff: JQuery<HTMLElement>
  let loadedImgItemElementBuff: HTMLImageElement
  let imageItemElementStrBuff: string

  contentsAreaElement.empty()

  for(let aii of anotatedImgInfos){
    for(let adk in aii.anotateData){
      for(let ad of aii.anotateData[adk]){
        imageItemElementStrBuff = /*html*/`
          <div class='anotatedImageViewAreaImageBackground'>
            <img class='anotatedImageViewAreaImage' src='${aii.path}'>
            <div class='anotatedImageViewAreaImageInfo'>${adk}</div>
          </div>
        `
        newItemElementBuff = $(imageItemElementStrBuff)
        imgItemElementBuff = newItemElementBuff.children('img')

        imgItemElementBuff.on('load', (ev: JQuery.TriggeredEvent) => {
          loadedImgItemElementBuff = $(ev.currentTarget)[0]
          $(ev.currentTarget).css('object-view-box', `inset(${ad.y1}px ${loadedImgItemElementBuff.naturalWidth - ad.x2}px ${loadedImgItemElementBuff.naturalHeight - ad.y2}px ${ad.x1}px)`)
        })
        contentsAreaElement.append(newItemElementBuff)
      }
    }
  }
}

$(function (){
  $('#anotatedImageViewAreaBackBtn').on('click', async () => {
    closeAllArea()
    await resetSelectDatabaseList()
    $('#selectDatabaseListArea').css('display', 'block')
  })
})