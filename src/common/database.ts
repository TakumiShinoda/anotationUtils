import { databaseInfo, databaseItem, itemCounts } from './database.d'

export function countItems(databaseInfo: databaseInfo): {[databasekey: string]: itemCounts}{
  let itemBuff: databaseItem
  let result: {[databasekey: string]: itemCounts} = {}

  for(let databaseKey in databaseInfo){
    itemBuff = databaseInfo[databaseKey]
    result[databaseKey] = {items: 0, movies: 0}

    for(let itemKey in itemBuff){
      if(typeof(databaseInfo[databaseKey][itemKey]) == 'object'){
        result[databaseKey].movies++
      }else{
        result[databaseKey].items++
      }
    }
  }

  return result
}