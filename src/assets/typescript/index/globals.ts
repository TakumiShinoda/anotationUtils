import * as Fabric from 'fabric'

import { IpcProgressHandler } from '../ipcProgressHandler'
import { DialogHistoryKey } from '../preloads/index/preload'

declare global{
  interface Window{
    IpcProgress: IpcProgressHandler,
    RootPath: string,
    InitialDialogHistories: {[key in DialogHistoryKey]: string}
    AnotatedImageViewIsSelectMode: boolean
    AnotationEditorFabricCanvas: Fabric.Canvas
    AnotationEditorFabricImage: Fabric.FabricImage | undefined
  }
}