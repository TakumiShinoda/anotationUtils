import { wait } from "../utils"

export interface AlertModalSetting{
  mesColor?: string,
  backColor?: string
}

const DefaultAlertModalSetting: AlertModalSetting = {
  mesColor: '0x000000',
  backColor:'0xFFFFFF'
}
const TransitionSec: number = 0.5

export async function showAlertModal(mes: string, setting: AlertModalSetting = DefaultAlertModalSetting){
  let modal: JQuery<HTMLElement> = $('#alertModal')
  let mesElement: JQuery<HTMLElement> = $('#alertModalMes')

  if(setting.mesColor == undefined) setting.mesColor = DefaultAlertModalSetting.mesColor as string
  if(setting.backColor == undefined) setting.backColor = DefaultAlertModalSetting.backColor as string

  mesElement.text(mes)
  mesElement.css('color', setting.mesColor)
  mesElement.css('background-color', setting.backColor)
  
  modal.css('transition', `0s`)
  modal.css('opacity', '0')
  modal.css('display', 'flex')
  await wait(1)
  modal.css('transition', `${TransitionSec}s`)
  modal.css('opacity', '1')
}

export async function showWarningAlert(mes: string){
  await showAlertModal(mes, {
    backColor: 'var(--bs-danger)',
    mesColor: 'white'
  })
}

export async function showSuccussAlert(mes: string){
  await showAlertModal(mes, {
    backColor: 'var(--bs-success)',
    mesColor: 'white'
  })
}

$(function (){
  $('#alertModal').on('click', async() => {
    $('#alertModal').css('transition', `${TransitionSec}s`)
    $('#alertModal').css('opacity', '0')
    await wait(TransitionSec * 1000)
    $('#alertModal').css('display', 'none')
  })
})