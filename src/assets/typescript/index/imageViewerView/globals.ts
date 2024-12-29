import { ImagePreviewListItem } from "../../preloads/index/preload"

export const LoadModeList = ['Error', 'AllImg', 'Directory'] as const
export type LoadMode = (typeof LoadModeList)[number]

declare global{
  interface Window{
    IsImgViewImageMouseCover: boolean
    IsImgViewPrevNextBtnMouseCover: boolean
    ImageViewImagePreviewId: number
    LoadedImageViewPaths: ImagePreviewListItem[]
    LoadedPathDict: {[key: string]: {imgName: string, imgSize: {w: number, h: number}, dataSize: number}[]}
    IsImgNamePathCopying: boolean
    LoadModeState: LoadMode
    ImagePreviewDirModeFilter: {filter: string, depth: number}
  }
}