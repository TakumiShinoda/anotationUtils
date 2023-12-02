export interface databaseItem{
  [itemNameKeys: string]: string | {[movieItemNameKeys: string]: string}
}

export interface databaseInfo{
  [databaseKeys: string]: databaseItem
}

export interface itemCounts{
  items: number,
  movies: number
}