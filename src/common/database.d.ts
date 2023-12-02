export interface databaseInfo{
  [databaseKeys: string]: {
    [itemNameKeys: string]: string | {[movieItemNameKeys: string]: string}
  }
}

export interface itemCounts{
  items: number,
  movies: number
}