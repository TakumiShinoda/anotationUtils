import '../../css/index/styles.css'

import './sideMenu'
import './autoAnotationView'
import './selectDatabaseView'
import './imageViewerView/imageViewerView'

import { wait } from '../utils'

$(window).on('load', async() => {
  await wait(1000)
  window.electronAPI.domLoaded()
})

$(function (){
  $('#exitAppButton').on('click', () => {
    window.electronAPI.exitApp()
    console.log("exit")
  })
})
