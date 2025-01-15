import { ipcRenderer, IpcRendererEvent } from "electron"

export interface ProgressProc{
  progressId: number,
  callback: (progressPercent: number, ...args: any[]) => void
}

export class IpcProgressHandler{
  private sockets: ProgressProc[] = []

  constructor(){
    window.electronAPI.on('ipcProgressOn', (_, progressId: number, progressPercent: number) => {
      let proc: ProgressProc | undefined = this.getProgress(progressId)

      if(proc == undefined) return

      console.log(`${progressId} : ${progressPercent}`)
      proc.callback(progressPercent)
    })
  }

  public getProgress(progressId: number): ProgressProc | undefined{
    let result: ProgressProc | undefined = undefined

    for(let s of this.sockets){
      if(progressId == s.progressId){
        result = s
        break
      }
    }

    return result
  }

  public isExistProgress(progressId: number): boolean{
    if(this.getProgress(progressId) == undefined) return false
    else return true
  }

  public addProgress(callback: (progressPercent: number) => void): number{
    let progressId: number

    while(true){
      progressId = Math.floor(Math.random() * 1000)

      if(!this.isExistProgress(progressId)) break
    }

    this.sockets.push({
      progressId: progressId,
      callback: callback
    })

    return progressId
  }
}