import { toggleUserControl } from '.'
import { AnotatedTree } from '../preloads/index/preload'
import { countItems } from './../../../common/database'
import { databaseInfo, itemCounts } from './../../../common/database.d'
import { showWarningAlert } from './alertModal'
import { showAnotatedImageView } from './anotatedImageView'

function creatDatabaseListItems(anotatedTree: AnotatedTree): string{
  let listItemElementStr: string = ''

  for(let atk in anotatedTree){
    listItemElementStr += /*html*/`
      <li class="list-group-item list-group-item-action list-group-flush">
        <div class="flexArea">
          <h4>${atk}</h4>
          <div class="flexArea">
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
  }

  return listItemElementStr
}

// function createDatabaseListItems(databaseInfo: databaseInfo): JQuery<HTMLElement>[]{
//   let counts: {[databasekey: string]: itemCounts} = countItems(databaseInfo)
//   let listHtmlStrBuff: string
//   let listBuff: JQuery<HTMLElement>
//   let result: JQuery<HTMLElement>[] = []

//   for(let databaseKey in databaseInfo){
//     listHtmlStrBuff = `
//       <li class="list-group-item list-group-item-action list-group-flush">
//         <div class="flexArea">
//           <h4>${databaseKey}</h4>
//           <div class="flexArea">
//             <div>
//               <div>Images:</div>
//               <div>Movies:</div>
//             </div>
//             <div>
//               <div>${counts[databaseKey].items}</div>
//               <div>${counts[databaseKey].movies}</div>
//             </div>
//           </div>
//         </div>
//       </li>
//     `
//     listBuff = $(listHtmlStrBuff)
//     // console.log(databaseInfo)

//     listBuff.on('click', () => {
//       // console.log(databaseInfo[databaseKey])
//       showAnotatedImageView(databaseInfo[databaseKey])
//     })
//     result.push(listBuff)
//   }

//   return result
// }

export async function resetSelectDatabaseList(){
  let selectDatabaseListElement: JQuery<HTMLElement> = $('#selectDatabaseList')
  let progressBarAreaElement: JQuery<HTMLElement> = $('#selectDatabaseViewprogressBarArea')
  let progressBarElement: JQuery<HTMLElement> = $('#selectDatabaseViewprogressBarArea .progress .progress-bar')
  let anotatedTree: AnotatedTree
  let progressId: number

  try{
    selectDatabaseListElement.children('li').remove()

    toggleUserControl(false)
    progressBarElement.css('width', '0%')
    progressBarAreaElement.css('display', 'flex')

    progressId = window.IpcProgress.addProgress((progressPercent: number) => {
      progressBarElement.css('width', `${progressPercent * 100}%`)
    })
    
    anotatedTree = await window.electronAPI.getAnotatedTree()
    console.log(anotatedTree)
    selectDatabaseListElement.append(creatDatabaseListItems(anotatedTree))

    progressBarAreaElement.css('display', 'none')
    toggleUserControl(true)
  }catch(err){
    showWarningAlert('Unknow error.')
  }
}

$(function (){
})