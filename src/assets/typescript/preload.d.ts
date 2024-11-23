import { CustomError, isCustomErrors } from '../../common/customErrors'
import { databaseInfo } from '../../common/database.d'

export interface IElectronAPI {
  openFileDialog: (filters: {extensions: string[], name: string}[]) => Promise<string[] | undefined>,
  openFolderDialog: () => Promise<string | undefined>,
  loadAnotationTarget: (anotationName: string | undefined, targetModel: string | undefined, targetDir: string | undefined) => Promise<CustomError | boolean>,
  getDatabaseInfo: () => Promise<databaseInfo>,
  getImageViewList: (imageViewDir: string) => Promise<{imgSize: {w: number, h: number}, dataSize: number, path: string}[]>
  exitApp: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}