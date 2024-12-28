export function cvtNum2DataSizeStr(val: number): string{
  let cvtLevelStr: string = 'B'
  let cvtNumber: number = val
  
  if(val >= 1024){
    cvtLevelStr = 'KB'
    cvtNumber = Math.round(val / 1024)
  }
  
  if(val >= (1024 ** 2)){
    cvtLevelStr = 'MB'
    cvtNumber = Math.round(val / (1024 ** 2))
  }
  
  if(val >= (1024 ** 3)){
    cvtLevelStr = 'GB'
    cvtNumber = Math.round(val / (1024 ** 3))
  }

  return `${cvtNumber}${cvtLevelStr}`
}

export function getLastElement(list: any[]){
  return list[list.length - 1]
}

export async function wait(millis: number): Promise<void>{
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, millis)
  })
}