import * as Fabric from 'fabric'
import { toggleAnotatedImageViewArea } from './anotatedImageView'

function fitAnotationEditorFabricImage(){
  let fitSize: {w: number, h: number} = {w: window.AnotationEditorFabricCanvas.width, h: window.AnotationEditorFabricCanvas.height}
  let fabricImageSize: {w: number, h: number}
  let fitSizeAspect: number = fitSize.w / fitSize.h
  let fabricImageAspect: number
  let resizeScale: number

  if(window.AnotationEditorFabricImage == undefined) return

  fabricImageSize = {w: window.AnotationEditorFabricImage.width, h: window.AnotationEditorFabricImage.height}
  fabricImageAspect = fabricImageSize.w / fabricImageSize.h

  if(fabricImageAspect > fitSizeAspect) resizeScale = fitSize.w / window.AnotationEditorFabricImage.width
  else resizeScale = fitSize.h / window.AnotationEditorFabricImage.height
  
  window.AnotationEditorFabricImage.scaleX = resizeScale
  window.AnotationEditorFabricImage.scaleY = resizeScale
  window.AnotationEditorFabricImage.top = (window.AnotationEditorFabricCanvas.height - (fabricImageSize.h * resizeScale)) / 2
  window.AnotationEditorFabricImage.left = (window.AnotationEditorFabricCanvas.width - (fabricImageSize.w * resizeScale)) / 2
}

function fitAnotationEditorFabricCanvas(){
  let contentsAreaElement: JQuery<HTMLElement> = $('#anotationEditorAreaContentsArea')

  window.AnotationEditorFabricCanvas.setDimensions({
    width: contentsAreaElement.width() as number - 20,
    height: contentsAreaElement.height() as number - 20
  })
  window.AnotationEditorFabricCanvas.renderAll()
}

function fitAnotationEditor(){
  fitAnotationEditorFabricCanvas()
  fitAnotationEditorFabricImage()
}

export async function resetAnotationEditor(imgPath: string){
  window.AnotationEditorFabricImage = await Fabric.FabricImage.fromURL(imgPath)

  window.AnotationEditorFabricCanvas.clear()
  fitAnotationEditor()

  window.AnotationEditorFabricImage.selectable = false
  window.AnotationEditorFabricCanvas.add(window.AnotationEditorFabricImage)
}


$(function (){
  let canvasElement: JQuery<HTMLCanvasElement> = $('#anotationEditorAreaCanvas')
  let canvasContainerElement: JQuery<HTMLElement>

  window.AnotationEditorFabricCanvas = new Fabric.Canvas(canvasElement.get(0))
  canvasContainerElement = canvasElement.parent('.canvas-container')
  canvasContainerElement.css('width', '100%')
  canvasContainerElement.css('height', '100%')
  canvasContainerElement.children('canvas').css('width', '100%')
  canvasContainerElement.children('canvas').css('height', '100%')

  const observer = new ResizeObserver((entries) => {
    fitAnotationEditor()
  })
  observer.observe($('#anotationEditorAreaContentsArea')[0])

  $('#anotationEditorAreaBackBtn').on('click', () => {
    toggleAnotatedImageViewArea('anotatedImageView')
  })
})