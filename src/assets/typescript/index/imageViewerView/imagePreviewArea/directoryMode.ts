import { ImagePreviewListItem } from "../../../preloads/index/preload"
import { clearPreviewArea, resetImagePreviewNaviArea } from "./ImagePreviewArea"
import { resetPreviewImages } from "./allImgMode"

function fitPathPreviewListItemPath(){
  const LastTextLength: number = 10

  let pathListItemElements: JQuery<HTMLElement> = $('.pathPreviewListItemPath')
  let pathListItemTextElementBuff: JQuery<HTMLElement>
  let pathTextBuff: string
  let newPathTextBuff: string
  let fontSizeBuff: number
  let pathListItemWidthBuff: number
  let maxTextLenBuff: number
  let frontTextEnd: number
  let backTextStart: number

  try{
    for(let plie of pathListItemElements){
      pathListItemTextElementBuff = $(plie).children('span')
      pathTextBuff = pathListItemTextElementBuff.attr('originPath') as string

      pathListItemTextElementBuff.text(pathTextBuff)

      pathListItemWidthBuff = $(plie).width() as number
      fontSizeBuff =  Math.ceil((pathListItemTextElementBuff.width() as number) / pathTextBuff.length)
      maxTextLenBuff = Math.floor(pathListItemWidthBuff / fontSizeBuff)

      if(pathTextBuff.length < maxTextLenBuff - (LastTextLength + 3)) newPathTextBuff = pathTextBuff
      else{
        frontTextEnd = maxTextLenBuff - (LastTextLength + 3)
        backTextStart = pathTextBuff.length - LastTextLength

        if(frontTextEnd >= backTextStart) newPathTextBuff = pathTextBuff
        else newPathTextBuff = `${pathTextBuff.slice(0, frontTextEnd)}...${pathTextBuff.slice(backTextStart)}`
      }

      pathListItemTextElementBuff.text(newPathTextBuff)
    }
  }catch(err){ console.log(err) }
}

export function resetPreviewPathList(){
  let imageViewElementStr: string = ''
  let allImageCount: number = 0
  let splitPathBuff: string[]

  resetImagePreviewNaviArea()
  clearPreviewArea()
  $('#pathPreviewTable').css('display', 'flex')
  $('#imagePreviewControlAreaFilterArea').css('display', 'none')

  for(let key of Object.keys(window.LoadedPathDict)){
    splitPathBuff = key.split('/')

    if(window.ImagePreviewDirModeFilter.filter != ''){
      if(splitPathBuff.length < window.ImagePreviewDirModeFilter.depth) continue
      if(splitPathBuff[splitPathBuff.length - window.ImagePreviewDirModeFilter.depth].indexOf(window.ImagePreviewDirModeFilter.filter) < 0) continue
    }

    imageViewElementStr += `
      <tr class='pathPreviewListItem' style='display: flex; width: 100%; padding: 0px; background-color: rgb(0, 0, 0, 0);' path='${key}'>
        <td style='display: flex; width: 100%; padding: 0px; background-color: rgb(0, 0, 0, 0);'>
          <div class='btn btn-success pathPreviewListItemBtn' style=''>
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div class='pathPreviewListItemPath'>
                <span originPath='${key}'>
                  ${key}
                </span>
              </div>
              <div class='pathPreviewListItemImgCount'>
                ${window.LoadedPathDict[key].length}images
              </div>
            </div>
          </div>
        </td>
      </tr>
    `

    allImageCount += window.LoadedPathDict[key].length
  }

  imageViewElementStr += `</tbody></table>`

  $('#pathPreviewArea').append(imageViewElementStr)
  fitPathPreviewListItemPath()
  $('#imageCounts').text(allImageCount.toString())
  $('.pathPreviewListItem').on('click', (ev: JQuery.ClickEvent) => {
    let path: string = $(ev.currentTarget).attr('path') as string
    let previewList: ImagePreviewListItem[] = []

    for(let lpd of window.LoadedPathDict[path]){
      previewList.push({
        imgSize: lpd.imgSize, 
        dataSize: lpd.dataSize, 
        path: `${path}/${lpd.imgName}`
      })
    }

    resetPreviewImages(previewList)
    resetImagePreviewNaviArea()
    $('#previewAreaPager').css('display', 'block')
  })
}

$(function (){
  $('#previewDirFilterInput').on('change', (ev: JQuery.TriggeredEvent) => {
    window.ImagePreviewDirModeFilter.filter = $(ev.currentTarget).val()
  })

  $('#previewDirFilterDepthInput').on('input', (ev: JQuery.TriggeredEvent) => {
    let inputElement: JQuery<HTMLElement> = $(ev.currentTarget)
    let inputValue: number = parseInt(inputElement.val() as string)

    if(isNaN(inputValue) || inputValue <= 0) inputValue = 1
    else if(inputValue > 10) inputValue = 10
    
    inputElement.val(inputValue)
    window.ImagePreviewDirModeFilter.depth = inputValue
  })

  $('#previewDirFilterBtn').on('click', () => {
    resetPreviewPathList()
  })

  $('#previewDirShowFilteredBtn').on('click', () => {
    let pathPreviewListItemElements: JQuery<HTMLElement> = $('.pathPreviewListItem')
    let previewList: ImagePreviewListItem[] = []
    let pathBuff: string

    for(let ppli of pathPreviewListItemElements){
      pathBuff = $(ppli).attr('path') as string

      for(let lpd of window.LoadedPathDict[pathBuff]){
        previewList.push({
          imgSize: lpd.imgSize, 
          dataSize: lpd.dataSize, 
          path: `${pathBuff}/${lpd.imgName}`
        })
      }
    }

    resetPreviewImages(previewList)
    resetImagePreviewNaviArea()
    $('#previewAreaPager').css('display', 'block')
  })

  $('#imageViewMaxPreviewImagesSlider').on('input', (ev: JQuery.TriggeredEvent) => {
    $('#imageViewMaxPreviewImagesInput').val($(ev.currentTarget).val())
  })

  $('#imageViewMaxPreviewImagesInput').on('input', (ev: JQuery.TriggeredEvent) => {
    let inputElement: JQuery<HTMLElement> = $(ev.currentTarget)
    let inputValue: number = parseInt(inputElement.val() as string)

    if(isNaN(inputValue) || inputValue <= 0) inputElement.val(1)
    else if(inputValue > 10000) inputElement.val(10000)

      $('#imageViewMaxPreviewImagesSlider').val(inputValue)
  })

  $(window).on('resize', () => {
    fitPathPreviewListItemPath()
  })
})