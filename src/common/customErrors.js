export const CustomErrorsEntity = {
  anotationProc: {
    processErrorCode: {
      main: 0,
      renderer: 1,
      subprocess: 2
    },
    errorMes: {
      isProcessing: 'Anotation processing.',
      emptyName: 'Empty name.',
      emptyTargetModel: 'Empty target model.',
      emptyTargetDir: 'Empty target directory.'
    }
  }
}

export function isCustomErrors(err){
  if(typeof(err) != 'object') return false
  if(
    !('code' in err) ||
    !('mes' in err)
  ) return false

  return true
}