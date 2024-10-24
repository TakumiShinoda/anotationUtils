import { databaseItem } from "../../../common/database.d"
import { hideAllViews } from "./sideMenu"

const setectedColor: string = 'rgb(11, 31, 209)'

export function showAnotatedImageView(databaseItem: databaseItem): void{
  const imageArea: JQuery<HTMLElement> = $('#anotatedImageView #imageArea')
  let imageSelectorBuff: JQuery<HTMLElement>
  let imageSelectorHtmlStrBuff: string

  hideAllViews()
  imageArea.children().remove()

  for(let d in databaseItem){
    if(typeof(databaseItem[d]) != 'string') continue

    imageSelectorHtmlStrBuff = `
      <div class="imageSelectBox">
        <img src="${databaseItem[d]}" width=100px height=100px}>
      </div>
    `

    imageSelectorBuff = $(imageSelectorHtmlStrBuff)
    imageSelectorBuff.on('click', function (){
      let isSelected: boolean = ($(this).attr('selected') == 'selected')

      if(isSelected){
        $(this).css('background-color', '')
        $(this).removeAttr('selected')
      }else{
        $(this).css('background-color', setectedColor)
        $(this).attr('selected', 'selected')
      }
    })

    imageArea.append(imageSelectorBuff)
  }

  $('#anotatedImageView').show()
}

$(function (){
  $('#anotatedImageView #selectAllButton').on('click', () => {
    let imageSelecters: JQuery<HTMLElement> = $('#anotatedImageView #imageArea').children('.imageSelectBox')

    for(let i of imageSelecters){
      $(i).css('background-color', setectedColor)
      $(i).attr('selected', 'selected')
    }
  })

  $('#anotatedImageView #clearButton').on('click', () => {
    let imageSelecters: JQuery<HTMLElement> = $('#anotatedImageView #imageArea').children('.imageSelectBox')

    for(let i of imageSelecters){
      $(i).css('background-color', '')
      $(i).removeAttr('selected')
    }
  })
})