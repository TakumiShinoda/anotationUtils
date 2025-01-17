require('../globals')

function httpApiProgress(request, response){
  const QUERY_KEY_PROGRESS_ID = 'progressId'
  const QUERY_KEY_PROGRESS = 'progress'

  let query = request.query
  let progressId
  let progress

  console.log(query)

  if(!(QUERY_KEY_PROGRESS_ID in query) || !(QUERY_KEY_PROGRESS in query)){
    response.sendStatus(500)
    return
  }

  progressId = parseInt(query[QUERY_KEY_PROGRESS_ID])
  progress = parseFloat(query[QUERY_KEY_PROGRESS])

  if(isNaN(progressId) || isNaN(progress)){
    response.sendStatus(500)
    return
  }

  MainWindow.webContents.send('ipcProgressOn', progressId, progress)

  response.send('')
}

module.exports= {
  httpApiProgress: httpApiProgress
}