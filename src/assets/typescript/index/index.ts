import '../../css/index/styles.css'

import './sideMenu'
import './autoAnotationView'
import './selectDatabaseView'

$(function (){
  $('#exitAppButton').on('click', () => {
    (window as any).electronAPI.exitApp()
    console.log("exit")
  })
});
