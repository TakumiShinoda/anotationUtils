import './selectDatabaseListArea'
import './anotatedImageViewArea'
import './anotationEditor'

export const AnotatedImageViewAreaList = ['selectDatabaseList', 'anotatedImageView', 'anotationEditor'] as const
export type AnotatedImageViewArea = (typeof AnotatedImageViewAreaList)[number]

export function closeAllAnotatedImageViewArea(){
  $('#selectDatabaseListArea').css('display', 'none')
  $('#anotatedImageViewArea').css('display', 'none')
  $('#anotationEditorArea').css('display', 'none')
}

export function toggleAnotatedImageViewArea(visibleArea: AnotatedImageViewArea){
  closeAllAnotatedImageViewArea()

  if(visibleArea == 'selectDatabaseList') $('#selectDatabaseListArea').css('display', 'block')
  else if(visibleArea == 'anotatedImageView') $('#anotatedImageViewArea').css('display', 'flex')
  else if(visibleArea == 'anotationEditor') $('#anotationEditorArea').css('display', 'flex')
}

$(function () {
  window.AnotatedImageViewIsSelectMode = false
})