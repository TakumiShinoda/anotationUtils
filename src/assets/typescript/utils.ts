export interface modalSetting{
  mesColor: string,
  backColor: string
}

export function showAlertModal(mes: string, setting: modalSetting = {mesColor: '0x000000', backColor: '0xFFFFFF'}){
  let modal: any = $('#alertModal')
  let content: JQuery<HTMLElement>= $('#alertModalContent')
  let body: JQuery<HTMLElement> = $('#alertModalBody')
  let mesElement: JQuery<HTMLElement> = $('#alertModalMes')

  content.css('backgroundColor', setting.backColor)
  body.css('color', setting.mesColor)
  mesElement.text(mes)
  modal.modal()
}