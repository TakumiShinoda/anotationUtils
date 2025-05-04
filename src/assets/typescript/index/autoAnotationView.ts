import { toggleUserControl } from './index';
import { CustomError, isCustomErrors } from '../../../common/customErrors'
import { showSuccussAlert, showWarningAlert } from './alertModal';

$(function (){
  $('#modelPathInputButton').on('click', async () => {
    let dialogFilter: {extensions: string[], name: string}[] = [
      {
        extensions: ['*pt'], 
        name: 'Torch model'
      }
    ]
    let filePath: string[] | undefined = await window.electronAPI.openFileDialog(dialogFilter, 'autoAnotationModelPathDialog')

    if(filePath == undefined) return

    $('#modelPathInputField').val(filePath)
  })

  $('#imagePathInputButton').on('click', async () => {
    let directry: string | undefined = await window.electronAPI.openFolderDialog('autoAnotationImagePathDialog')

    if(directry == undefined) return

    $('#imagePathInputField').val(directry)
  })

  $('#startLoadButton').on('click', async () => {
    let progressBarAreaElement: JQuery<HTMLElement> = $('#autoAnotationViewProgressBarArea')
    let progressBarElement: JQuery<HTMLElement> = $('#autoAnotationViewProgressBarArea .progress .progress-bar')
    let anotationName: string | undefined = $('#anotationNameInputField').val()?.toString()
    let modelPath: string | undefined = $('#modelPathInputField').val()?.toString()
    let imagePath: string | undefined = $('#imagePathInputField').val()?.toString()
    let anotationProcResult: CustomError | boolean
    let progressId: number

    try{
      toggleUserControl(false)
      progressBarAreaElement.css('display', 'flex')

      progressId = window.IpcProgress.addProgress((progressPercent: number) => {
        progressBarElement.css('width', `${progressPercent * 100}%`)
      })
      anotationProcResult = await window.electronAPI.loadAnotationTarget(anotationName, modelPath, imagePath, progressId)

      if(isCustomErrors(anotationProcResult)){
        showWarningAlert(anotationProcResult.mes)
        return
      }else if(!anotationProcResult) throw ''
      
      showSuccussAlert('Anotation succes!')
    }catch(err){
      showWarningAlert('Unknow error.')
    }finally{
      progressBarAreaElement.css('display', 'none')
      toggleUserControl(true)
    }
  })
})