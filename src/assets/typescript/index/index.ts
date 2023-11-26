import '../../css/index/styles.css'
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
    const alertErrorModalSetting: modalSetting = {backColor: '#ad463a', mesColor: '#FFFFFF'}
    const alertSuccessModalSetting: modalSetting = {backColor: '#2ea043', mesColor: '#FFFFFF'}
    let anotationName: string | undefined = $('#anotationNameInputField').val()?.toString()
    let modelPath: string | undefined = $('#modelPathInputField').val()?.toString()
    let imagePath: string | undefined = $('#imagePathInputField').val()?.toString()
    let anotationProcResult: CustomError | boolean

    try{
      anotationProcResult = await (window as any).electronAPI.loadAnotationTarget(anotationName, modelPath, imagePath)

      if(isCustomErrors(anotationProcResult)){
        showAlertModal(anotationProcResult.mes, alertErrorModalSetting)
        return
      }else if(!anotationProcResult) throw ''
      
      showAlertModal('Anotation succes!', alertSuccessModalSetting)
    }catch(err){
      showAlertModal('Unknow error.', alertErrorModalSetting)
    }
  })

  $('#exitAppButton').on('click', () => {
    (window as any).electronAPI.exitApp()
    console.log("exit")
  })
});
