$(function (){
  $('#openFolderBtn').on('click', async() => {
    let openFolderDir: string

    openFolderDir = await (window as any).electronAPI.openFolderDialog()
    $('#openFolderDirInputField').val(openFolderDir)
  })

  $('#loadFolderBtn').on('click', async() => {
    let imageViewDir: string = $('#openFolderDirInputField').val() as string
    let imageViewPaths: string[]
    let imageElementBuff: string
    let imagePreviewSize: string = $('#imageViewImageSizeSlider').val() as string

    $('#imageViewArea').empty()

    try{
      imageViewPaths = await (window as any).electronAPI.getImageViewList(imageViewDir)

      if(imageViewPaths.length > 10000){
        alert(`${imageViewPaths.length}images found.\nToo much images.`)
        return
      }

      $('#imageCounts').text(imageViewPaths.length.toString())

      for(let ivp of imageViewPaths){
        imageElementBuff = `
          <span width="${imagePreviewSize}px" height="${imagePreviewSize}px">
            <img class="imageViewImage" src="${ivp}" width="${imagePreviewSize}px" height="${imagePreviewSize}px">
          </span>
        `

        $('#imageViewArea').append(imageElementBuff)
      }
    }catch(err){
      alert('error')
    }
  })

  $('#imageViewImageSizeSlider').on('input', (ev: JQuery.TriggeredEvent) => {
    let imageSizeStr: string = ev.currentTarget.value

    $('#imageViewImageSize').text(imageSizeStr)

    for(let imageBackgroundElement of $('#imageViewArea').children()){
      imageBackgroundElement.setAttribute('width', `${imageSizeStr}px`)
      imageBackgroundElement.setAttribute('height', `${imageSizeStr}px`)
    }

    for(let imageElement of $('.imageViewImage')){
      imageElement.setAttribute('width', `${imageSizeStr}px`)
      imageElement.setAttribute('height', `${imageSizeStr}px`)
    }
  })
})