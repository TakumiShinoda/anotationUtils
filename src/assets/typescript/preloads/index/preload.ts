import { IpcRendererEvent } from 'electron'

export interface AnotateData{
  [tagName: string]: {x1: number, y1: number, x2: number, y2: number, selected: boolean}[]
}

export interface AnotatedImgInfo{
  path: string,
  anotateData: AnotateData
}

export interface AnotatedTree{
  [treeName: string]: AnotatedImgInfo[]
}

export interface ImagePreviewListItem{
  imgSize: {w: number, h: number}, 
  dataSize: number, 
  path: string
}

export const DialogHistoryKeyList = [
  'autoAnotationModelPathDialog',
  'autoAnotationTrainYamlPathDialog',
  'autoAnotationImagePathDialog',
  'imageViewerOpenFolderDialog',
  'imageViewerSaveImgDialog',
] as const
export type DialogHistoryKey = (typeof DialogHistoryKeyList)[number]

export interface DialogHistory{
  imageViewerOpenFolderDialog: string,
  imageViewerSaveImgDialog: string
}

export interface DomLoadedInitItem{
  rootPath: string,
  dialogHistories: {[key in DialogHistoryKey]: string}
}

export interface IElectronAPI {
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void,
  openFileDialog: (filters: {extensions: string[], name: string}[], dialogHistoryKey: DialogHistoryKey) => Promise<string[] | undefined>,
  openFolderDialog: (dialogHistoryKey: DialogHistoryKey) => Promise<string | undefined>,
  loadAnotationTarget: (anotationName: string | undefined, targetModel: string | undefined, trainYaml: string | undefined, targetDir: string | undefined, progressId: number) => Promise<void>,
  getAnotatedTree: () => Promise<AnotatedTree>,
  saveAnotatedTree: (projectName: string, anotatedTree: AnotatedImgInfo[]) => Promise<void>,
  getImageViewList: (imageViewDir: string) => Promise<ImagePreviewListItem[]>,
  openByExplorer: (openDir: string) => Promise<void>,
  copyFile: (srcPath: string, dialogHistoryKey: DialogHistoryKey) => Promise<string>,
  domLoaded: () => Promise<DomLoadedInitItem>,
  minimizeWindow: () => Promise<void>,
  maximizeWindow: () => Promise<void>,
  closeWindow: (withExitApp?: boolean) => Promise<void>,
  exitApp: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}