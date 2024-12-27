import { IpcRendererEvent } from 'electron'

import { CustomError } from '../../common/customErrors'
import { databaseInfo } from '../../common/database.d'

export interface ImagePreviewListItem{
  imgSize: {w: number, h: number}, 
  dataSize: number, 
  path: string
}

export const DialogHistoryKeyList = [
  'autoAnotationModelPathDialog',
  'autoAnotationImagePathDialog',
  'imageViewerOpenFolderDialog',
  'imageViewerSaveImgDialog'
] as const
export type DialogHistoryKey = (typeof DialogHistoryKeyList)[number]

export interface DialogHistory{
  imageViewerOpenFolderDialog: string,
  imageViewerSaveImgDialog: string
}

export interface IElectronAPI {
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void,
  openFileDialog: (filters: {extensions: string[], name: string}[], dialogHistoryKey: DialogHistoryKey) => Promise<string[] | undefined>,
  openFolderDialog: (dialogHistoryKey: DialogHistoryKey) => Promise<string | undefined>,
  loadAnotationTarget: (anotationName: string | undefined, targetModel: string | undefined, targetDir: string | undefined) => Promise<CustomError | boolean>,
  getDatabaseInfo: () => Promise<databaseInfo>,
  getImageViewList: (imageViewDir: string) => Promise<ImagePreviewListItem[]>,
  copyFile: (srcPath: string, dialogHistoryKey: DialogHistoryKey) => Promise<string>
  domLoaded: () => Promise<void>
  exitApp: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}