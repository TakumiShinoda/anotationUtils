import { toggleUserControl } from './index';
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

  $('#trainYamlInputButton').on('click', async () => {
    let dialogFilter: {extensions: string[], name: string}[] = [
      {
        extensions: ['*yaml'], 
        name: 'Train YAML'
      }
    ]
    let filePath: string[] | undefined = await window.electronAPI.openFileDialog(dialogFilter, 'autoAnotationTrainYamlPathDialog')

    if(filePath == undefined) return

    $('#trainYamlInputField').val(filePath)
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
    let trainYamlPath: string | undefined = $('#trainYamlInputField').val()?.toString()
    let imagePath: string | undefined = $('#imagePathInputField').val()?.toString()
    let progressId: number

    try{
      toggleUserControl(false)
      progressBarAreaElement.css('display', 'flex')

      progressId = window.IpcProgress.addProgress((progressPercent: number) => {
        progressBarElement.css('width', `${progressPercent * 100}%`)
      })
      await window.electronAPI.loadAnotationTarget(anotationName, modelPath, trainYamlPath, imagePath, progressId)
      
      showSuccussAlert('Anotation succes!')
    }catch(err){
      showWarningAlert(err as string)
    }finally{
      progressBarAreaElement.css('display', 'none')
      toggleUserControl(true)
    }
  })
})