import { countItems } from './../../../common/database'
import { databaseInfo, itemCounts } from './../../../common/database.d'
import { AlertModalSetting, showWarningAlert } from './alertModal'
import { showAnotatedImageView } from './anotatedImageView'

function createDatabaseListItems(databaseInfo: databaseInfo): JQuery<HTMLElement>[]{
  let counts: {[databasekey: string]: itemCounts} = countItems(databaseInfo)
  let listHtmlStrBuff: string
  let listBuff: JQuery<HTMLElement>
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
              <div>${counts[databaseKey].items}</div>
              <div>${counts[databaseKey].movies}</div>
            </div>
          </div>
        </div>
      </li>
    `
    listBuff = $(listHtmlStrBuff)
    console.log(databaseInfo)

    listBuff.on('click', () => {
      console.log(databaseInfo[databaseKey])
      showAnotatedImageView(databaseInfo[databaseKey])
    })
    result.push(listBuff)
  }

  return result
}

$(function (){
  const electronWindow: any = window

  $('#databaseList').on('inview', async (_, isInView: boolean) => {
    const alertErrorModalSetting: AlertModalSetting = {backColor: '#ad463a', mesColor: '#FFFFFF'}
    let databaseInfo: databaseInfo

    if(!isInView){
      $('#databaseList').children('li').remove()
      return
    }

    try{
      databaseInfo = await electronWindow.electronAPI.getDatabaseInfo()

      $('#databaseList').append(createDatabaseListItems(databaseInfo))
    }catch(err){
      showWarningAlert('Unknow error.')
    }
  })
})