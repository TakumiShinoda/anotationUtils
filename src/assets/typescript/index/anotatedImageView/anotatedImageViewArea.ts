import { AnotateData, AnotatedImgInfo } from "../../preloads/index/preload"
import { showSuccussAlert, showWarningAlert } from "../alertModal"
import { toggleAnotatedImageViewArea } from "./anotatedImageView"
import { resetHeaderName, resetSelectDatabaseList } from "./selectDatabaseListArea"

export function resetAnotatedImageViewArea(projectName: string, anotatedImgInfos: AnotatedImgInfo[]){
  let contentsAreaElement: JQuery<HTMLElement> = $('#anotatedImageViewAreaContentsArea')
  let newItemElementBuff: JQuery<HTMLElement>
  let imgItemElementBuff: JQuery<HTMLElement>
  let selectedIconElementBuff: JQuery<HTMLElement>
  let imageItemElementStrBuff: string

  contentsAreaElement.empty()
  resetHeaderName(projectName)

  for(let aii of anotatedImgInfos){
    for(let adk in aii.anotateData){
      for(let ad of aii.anotateData[adk]){
        imageItemElementStrBuff = /*html*/`
          <div class='anotatedImageViewAreaImageBackground'>
            <img class='anotatedImageViewAreaImage' src='${aii.path}' tag=${adk} x1=${ad.x1} y1=${ad.y1} x2=${ad.x2} y2=${ad.y2}>
            <div class='anotatedImageViewAreaImageInfo'>${adk}</div>
            <div class='anotatedImageViewAreaImageStatusArea'>
              <div class="anotatedImageViewAreaImageSelectedIcon bi bi-check-square icon"></div>
            </div>
          </div>
        `
        newItemElementBuff = $(imageItemElementStrBuff)
        imgItemElementBuff = newItemElementBuff.children('img')
        selectedIconElementBuff = newItemElementBuff.find('.anotatedImageViewAreaImageSelectedIcon')

        if(ad.selected){
          selectedIconElementBuff.prop('selected', true)
          selectedIconElementBuff.css('visibility', 'visible')
        }else{
          selectedIconElementBuff.prop('selected', false)
          selectedIconElementBuff.css('visibility', 'hidden')
        }

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
    await resetSelectDatabaseList()
    toggleAnotatedImageViewArea("selectDatabaseList")
  })

  $('#anotatedImageViewAreaSaveBtn').on('click', async () => {
    let contentsAreaElement: JQuery<HTMLElement> = $('#anotatedImageViewAreaContentsArea')
    let imgElementBuff: JQuery<HTMLElement>
    let selectedIconElementBuff: JQuery<HTMLElement>
    let saveAnotatedInfos: AnotatedImgInfo[] = []
    let saveAnotatedInfoTree: {[path: string]: AnotateData} = {}
    let imgPathBuff: string
    let tagBuff: string
    let x1Buff: number
    let y1Buff: number
    let x2Buff: number
    let y2Buff: number
    let selectedBuff: boolean

    try{
      for(let ci of contentsAreaElement.children()){
        imgElementBuff = $(ci).children('img')
        selectedIconElementBuff = $(ci).find('.anotatedImageViewAreaImageSelectedIcon')
        imgPathBuff = imgElementBuff.attr('src') as string
        tagBuff = imgElementBuff.attr('tag') as string
        x1Buff = parseFloat(imgElementBuff.attr('x1') as string)
        y1Buff = parseFloat(imgElementBuff.attr('y1') as string)
        x2Buff = parseFloat(imgElementBuff.attr('x2') as string)
        y2Buff = parseFloat(imgElementBuff.attr('y2') as string)
        selectedBuff = selectedIconElementBuff.prop('selected')

        if(Object.keys(saveAnotatedInfoTree).indexOf(imgPathBuff) < 0){
          saveAnotatedInfoTree[imgPathBuff] = {}
        }

        if(Object.keys(saveAnotatedInfoTree[imgPathBuff]).indexOf(tagBuff) < 0){
          saveAnotatedInfoTree[imgPathBuff][tagBuff] = []
        }
        
        saveAnotatedInfoTree[imgPathBuff][tagBuff].push({x1: x1Buff, y1: y1Buff, x2: x2Buff, y2: y2Buff, selected: selectedBuff})
      }

      for(let saitk in saveAnotatedInfoTree){
        saveAnotatedInfos.push({path: saitk, anotateData: saveAnotatedInfoTree[saitk]})
      }

      await window.electronAPI.saveAnotatedTree($('#anotatedImageViewHeaderName').text(), saveAnotatedInfos)
      showSuccussAlert('Success.')
    }catch(err){
      showWarningAlert(err as string)
    }
  })
})