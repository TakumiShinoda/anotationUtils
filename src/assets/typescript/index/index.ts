import { IpcRendererEvent } from 'electron'

import '../../css/index/styles.css'

import './sideMenu'
import './autoAnotationView'
import './selectDatabaseView'
import './imageViewerView/imageViewerView'

import { wait } from '../utils'
import { IpcProgressHandler } from '../ipcProgressHandler'

window.IpcProgress = new IpcProgressHandler()

export function toggleUserControl(isUserControlEnable: boolean){
  if(isUserControlEnable) $('#disableFilter').css('display', 'none')
  else $('#disableFilter').css('display', 'flex')
}

$(window).on('load', async() => {
  await wait(1000)
  window.RootPath = await window.electronAPI.domLoaded()
})

window.electronAPI.on('debugPrint', (_: IpcRendererEvent, mes: string) => {
  console.log(mes)
})

$(function (){
  $('#exitAppButton').on('click', () => {
    window.electronAPI.exitApp()
    console.log("exit")
  })

  $('#disableFilter').on('click', (ev: JQuery.TriggeredEvent) => {
    console.log('STOPING')
    ev.stopPropagation()
  })
})
