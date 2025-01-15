import '../../css/index/styles.css'

import './sideMenu'
import './autoAnotationView'
import './selectDatabaseView'
import './imageViewerView/imageViewerView'

import { wait } from '../utils'
import { IpcProgressHandler } from '../ipcProgressHandler'

export function toggleUserControl(isUserControlEnable: boolean){
  if(isUserControlEnable) $('#disableFilter').css('display', 'none')
  else $('#disableFilter').css('display', 'flex')
}

$(window).on('load', async() => {
  await wait(1000)
  window.electronAPI.domLoaded()
})

$(function (){
  window.IpcProgress = new IpcProgressHandler()

  $('#exitAppButton').on('click', () => {
    window.electronAPI.exitApp()
    console.log("exit")
  })

  $('#disableFilter').on('click', (ev: JQuery.TriggeredEvent) => {
    console.log('STOPING')
    ev.stopPropagation()
  })
})
