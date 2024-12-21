import { CustomError, isCustomErrors } from '../../../common/customErrors'
import { modalSetting, showAlertModal } from '../utils';

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
    const alertErrorModalSetting: modalSetting = {backColor: '#ad463a', mesColor: '#FFFFFF'}
    const alertSuccessModalSetting: modalSetting = {backColor: '#2ea043', mesColor: '#FFFFFF'}
    let anotationName: string | undefined = $('#anotationNameInputField').val()?.toString()
    let modelPath: string | undefined = $('#modelPathInputField').val()?.toString()
    let imagePath: string | undefined = $('#imagePathInputField').val()?.toString()
    let anotationProcResult: CustomError | boolean

    try{
      anotationProcResult = await window.electronAPI.loadAnotationTarget(anotationName, modelPath, imagePath)

      if(isCustomErrors(anotationProcResult)){
        showAlertModal(anotationProcResult.mes, alertErrorModalSetting)
        return
      }else if(!anotationProcResult) throw ''
      
      showAlertModal('Anotation succes!', alertSuccessModalSetting)
    }catch(err){
      showAlertModal('Unknow error.', alertErrorModalSetting)
    }
  })
})