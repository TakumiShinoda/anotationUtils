import { toggleUserControl } from '../index'
import { AnotatedTree } from '../../preloads/index/preload'
import { showWarningAlert } from '../alertModal'
import { toggleAnotatedImageViewArea } from './anotatedImageView'
import { resetAnotatedImageViewArea } from './anotatedImageViewArea'

function creatDatabaseListItems(anotatedTree: AnotatedTree){
  let selectDatabaseListElement: JQuery<HTMLElement> = $('#selectDatabaseListAreaList')
  let newListItemElementBuff: JQuery<HTMLElement>
  let listItemElementStrBuff: string = ''

  for(let atk in anotatedTree){
    listItemElementStrBuff = /*html*/`
      <li class='list-group-item list-group-item-action list-group-flush selectDatabaseListItem'>
        <div class='flexArea'>
          <h4>${atk}</h4>
          <div class='flexArea'>
            <div>
              <div>Images:</div>
            </div>
            <div>
              <div>${anotatedTree[atk].length}</div>
            </div>
          </div>
        </div>
      </li>
    `
    newListItemElementBuff = $(listItemElementStrBuff)

    selectDatabaseListElement.append(newListItemElementBuff)
    newListItemElementBuff.on('click', () => {
      resetAnotatedImageViewArea(atk, anotatedTree[atk])
      toggleAnotatedImageViewArea('anotatedImageView')
    })
  }
}

export function resetHeaderName(headerName: string){
  $('#anotatedImageViewHeaderName').text(headerName)
}

export async function resetSelectDatabaseList(){
  let selectDatabaseListElement: JQuery<HTMLElement> = $('#selectDatabaseListAreaList')
  let progressBarAreaElement: JQuery<HTMLElement> = $('#selectDatabaseViewprogressBarArea')
  let progressBarElement: JQuery<HTMLElement> = $('#selectDatabaseViewprogressBarArea .progress .progress-bar')
  let anotatedTree: AnotatedTree
  let progressId: number

  try{
    selectDatabaseListElement.children('li').remove()

    toggleUserControl(false)
    resetHeaderName('Databases')
    progressBarElement.css('width', '0%')
    progressBarAreaElement.css('display', 'flex')

    progressId = window.IpcProgress.addProgress((progressPercent: number) => {
      progressBarElement.css('width', `${progressPercent * 100}%`)
    })
    
    anotatedTree = await window.electronAPI.getAnotatedTree()
    creatDatabaseListItems(anotatedTree)

    progressBarAreaElement.css('display', 'none')
    toggleUserControl(true)
  }catch(err){
    showWarningAlert('Unknow error.')
  }
}

$(function (){
})