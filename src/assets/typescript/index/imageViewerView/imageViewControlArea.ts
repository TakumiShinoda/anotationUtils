import { turnPageImageView } from "./imageViewArea"

function appearCopiedText(){
  const diappearMillis: number = 600
  const diappearSteps: number = 10
  const intervalMillis: number = Math.floor(diappearMillis / diappearSteps)
  const opacityDecrease: number =  (1 / diappearSteps)

  let textElement: JQuery<HTMLElement> = $('#imageViewControlAreaCopiedText')
  let intervalObj: NodeJS.Timer
  let opacityBuff: number

  if(window.IsImgNamePathCopying) return

  window.IsImgNamePathCopying = true
  textElement.css('visibility', 'visible')
  textElement.css('opacity', 1)
  
  intervalObj = setInterval(() => {
    opacityBuff = parseFloat(textElement.css('opacity')) - opacityDecrease

    if(opacityBuff <= 0){
      textElement.css('visibility', 'hidden')
      clearInterval(intervalObj)
      window.IsImgNamePathCopying = false
    }else textElement.css('opacity', opacityBuff)
  }, intervalMillis);
}

$(function (){
  $('#imageViewControlAreaCopyNameBtn').on('click', (ev: JQuery.ClickEvent) => {
    navigator.clipboard.writeText($('#imageViewControlAreaImagePath').val() as string)
    appearCopiedText()
  })

  $('#imageViewControlAreaCopyPathBtn').on('click', (ev: JQuery.ClickEvent) => {
    navigator.clipboard.writeText($('#imageViewControlAreaImagePath').attr('fullPath') as string)
    appearCopiedText()
  })

  $('#imageViewControlAreaViewSizeSlider').on('input', (ev: JQuery.TriggeredEvent) => {
    $('#imageViewControlAreaViewSizeInput').val($(ev.currentTarget).val())
  })

  $('#imageViewControlAreaViewSizeInput').on('input', (ev: JQuery.TriggeredEvent) => {
    let inputElement: JQuery<HTMLElement> = $(ev.currentTarget)
    let inputValue: number = parseInt(inputElement.val() as string)

    if(isNaN(inputValue) || inputValue <= 100) inputElement.val(100)
    else if(inputValue > 1000) inputElement.val(1000)

    $('#imageViewControlAreaViewSizeSlider').val(inputValue)
  })

  $('#imageViewControlAreaViewResetBtn').on('click', () => {
    turnPageImageView(0)
  })

  $('#imageViewControlAreaSaveImgBtn').on('click', async () => {
    let imagePath: string = $('.imageViewImage').attr('src') as string
    let saveFolderPath: string | undefined

    try{
      saveFolderPath = await window.electronAPI.copyFile(imagePath)

      if(saveFolderPath == undefined) return

      alert('saved')
    }catch(err){
      alert(err)
    }
  })
})