import './selectDatabaseListArea'
import './anotatedImageViewArea'

export const AnotatedImageViewAreaList = ['selectDatabaseList', 'anotatedImageView'] as const
export type AnotatedImageViewArea = (typeof AnotatedImageViewAreaList)[number]

export function closeAllAnotatedImageViewArea(){
  $('#selectDatabaseListArea').css('display', 'none')
  $('#anotatedImageViewArea').css('display', 'none')
}

export function toggleAnotatedImageViewArea(visibleArea: AnotatedImageViewArea){
  closeAllAnotatedImageViewArea()

  if(visibleArea == 'selectDatabaseList') $('#selectDatabaseListArea').css('display', 'block')
  else if(visibleArea == 'anotatedImageView') $('#anotatedImageViewArea').css('display', 'flex')
}

$(function () {
  window.AnotatedImageViewIsSelectMode = false
})