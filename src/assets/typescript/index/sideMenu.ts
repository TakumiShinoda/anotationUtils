function hideAllViews(): void{
  $('.views').hide()
}

$(function (){
  $('#sideMenu .icon').on('click', () => {
    hideAllViews()
  })

  $('#showAutoAnotaionViewIcon').on('click', () => {
    $('#autoAnotationView').show()
  })

  $('#showDatabaseViewIcon').on('click', () => {
    $('#selectDatabaseView').show()
  })
})