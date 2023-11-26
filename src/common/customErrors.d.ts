export const CustomErrorsEntity: CustomErrorsEntity
export function isCustomErrors(err: any): err is CustomError

interface processErrorCode{
  main: number,
  renderer: number,
  subprocess: number
}

interface errorMes{
  isProcessing: string,
  emptyName: string,
  emptyTargetModel: string,
  emptyTargetDir: string
}

interface CustomErrorsEntity{
  anotationProc: {
    processErrorCode: processErrorCode,
    errorMes: errorMes
  }
}

interface CustomError{
  code: number,
  mes: string
}