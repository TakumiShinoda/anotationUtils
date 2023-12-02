import 'jquery-inview'

import { countItems } from './../../../common/database'
import { databaseInfo, itemCounts } from './../../../common/database.d'
import { modalSetting, showAlertModal } from '../utils'

function createDatabaseListItems(databaseInfo: databaseInfo): JQuery<HTMLElement>[]{
  let counts: itemCounts = countItems(databaseInfo)
  let listHtmlStrBuff: string
  let result: JQuery<HTMLElement>[] = []

  for(let databaseKey in databaseInfo){
    listHtmlStrBuff = `
      <li class="list-group-item list-group-item-action list-group-flush">
        <div class="flexArea">
          <h4>${databaseKey}</h4>
          <div class="flexArea">
            <div>
              <div>Images:</div>
              <div>Movies:</div>
            </div>
            <div>
              <div>${counts.items}</div>
              <div>${counts.movies}</div>
            </div>
          </div>
        </div>
      </li>
    `

    result.push($(listHtmlStrBuff))
  }

  return result
}

$(function (){
  const electronWindow: any = window

  $('#databaseList').on('inview', async () => {
    const alertErrorModalSetting: modalSetting = {backColor: '#ad463a', mesColor: '#FFFFFF'}
    let databaseInfo: databaseInfo

    try{
      $('#databaseList').children('li').remove()
      databaseInfo = await electronWindow.electronAPI.getDatabaseInfo()

      for(let key in databaseInfo){
        $('#databaseList').append(createDatabaseListItems(databaseInfo))
      }
    }catch(err){
      showAlertModal('Unknow error.', alertErrorModalSetting)
    }
  })
})