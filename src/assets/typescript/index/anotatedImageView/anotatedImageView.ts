import './selectDatabaseListArea'
import './anotatedImageViewArea'

export function closeAllArea(){
  $('#selectDatabaseListArea').css('display', 'none')
  $('#anotatedImageViewArea').css('display', 'none')
}

$(function () {
  window.AnotatedImageViewIsSelectMode = false
})