import $ = require('jquery')

import '../../css/index/styles.css'

$(function (){
  $('#modelPathInputButton').on('click', async () => {
    let dialogFilter: {extensions: string[], name: string}[] = [
      {
        extensions: ['*pt'], 
        name: 'Torch model'
      }
    ]
    let files: string[] | undefined = await (window as any).electronAPI.openFileDialog(dialogFilter)
    console.log(files)

    if((files == undefined) || (files.length == 0)) return

    $('#modelPathInputField').val(files[0])
  })

  $('#imagePathInputButton').on('click', async () => {
    let directries: string[] | undefined = await (window as any).electronAPI.openFolderDialog()

    if((directries == undefined) || (directries.length == 0)) return

    $('#imagePathInputField').val(directries[0])
  })

  $('#startLoadButton').on('click', async () => {
    
  })

  $('#exitAppButton').on('click', () => {
    (window as any).electronAPI.exitApp()
    console.log("exit")
  })
});
