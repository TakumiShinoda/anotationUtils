import { toggleAnotatedImageViewArea } from "./anotatedImageView/anotatedImageView"
import { resetSelectDatabaseList } from "./anotatedImageView/selectDatabaseListArea"

declare global{
  interface Window{
    bootstrap: any
  }
}

export function hideAllViews(): void{
  $('.views').hide()
}

function initBootstapTooltip(){
  const tooltipTriggerList: NodeListOf<Element> = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = Array.from(tooltipTriggerList).map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl))
}

function clearSideMenuIcon(){
  $('#sideMenu>div>.iconContainer').css('background-color', 'rgba(0, 0, 0, 0)')
  $('#sideMenu>div>.disableHover').removeClass('disableHover')
}

$(function (){
  initBootstapTooltip()

  $('#showAutoAnotaionViewIcon').on('click', (ev: JQuery.TriggeredEvent) => {
    clearSideMenuIcon()
    $(ev.currentTarget).css('background-color', 'var(--bs-primary)')
    $(ev.currentTarget).addClass('disableHover')
    hideAllViews()
    $('#autoAnotationView').show()
  })

  $('#showDatabaseViewIcon').on('click', async (ev: JQuery.TriggeredEvent) => {
    clearSideMenuIcon()
    $(ev.currentTarget).css('background-color', 'var(--bs-primary)')
    $(ev.currentTarget).addClass('disableHover')
    hideAllViews()
    $('#anotatedImageView').show()
    await resetSelectDatabaseList()
    toggleAnotatedImageViewArea("selectDatabaseList")
  })

  $('#showImageViewerViewIcon').on('click', (ev: JQuery.TriggeredEvent) => {
    clearSideMenuIcon()
    $(ev.currentTarget).css('background-color', 'var(--bs-primary)')
    $(ev.currentTarget).addClass('disableHover')
    hideAllViews()
    $('#imageViewerView').show()
  })
})