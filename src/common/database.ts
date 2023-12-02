import { databaseInfo, itemCounts } from './database.d'

export function countItems(databaseInfo: databaseInfo): itemCounts{
  let itemBuff: {[itemNameKeys: string]: string | {[movieItemNameKeys: string]: string}}
  let result: itemCounts = {items: 0, movies: 0}

  for(let databaseKey in databaseInfo){
    itemBuff = databaseInfo[databaseKey]

    for(let itemKey in itemBuff){
      if(typeof(databaseInfo[databaseKey][itemKey]) == 'object'){
        result.movies++
      }else{
        result.items++
      }
    }
  }

  return result
}