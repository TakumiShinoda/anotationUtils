export interface modalSetting{
  mesColor: string,
  backColor: string
}

export function cvtNum2DataSizeStr(val: number): string{
  let cvtLevelStr: string = ''
  let cvtNumber: number = 0
  
  if(val >= 1024){
    cvtLevelStr = 'KB'
    cvtNumber = Math.round(val / 1024)
  }
  
  if(val >= (1024 ** 2)){
    cvtLevelStr = 'MB'
    cvtNumber = Math.round(val / (1024 ** 2))
  }
  
  if(val >= (1024 ** 3)){
    cvtLevelStr = 'GB'
    cvtNumber = Math.round(val / (1024 ** 3))
  }

  return `${cvtNumber}${cvtLevelStr}`
}

export function getLastElement(list: any[]){
  return list[list.length - 1]
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