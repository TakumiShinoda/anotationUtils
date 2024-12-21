export function hideAllViews(): void{
  $('.views').hide()
}

$(function (){
  $('#showAutoAnotaionViewIcon').on('click', () => {
    hideAllViews()
    $('#autoAnotationView').show()
  })

  $('#showDatabaseViewIcon').on('click', () => {
    hideAllViews()
    $('#selectDatabaseView').show()
  })

  $('#showImageViewerViewIcon').on('click', () => {
    hideAllViews()
    $('#imageViewerView').show()
  })
})