import { IpcProgressHandler } from '../ipcProgressHandler'

declare global{
  interface Window{
    IpcProgress: IpcProgressHandler
  }
}