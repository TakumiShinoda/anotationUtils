const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { spawn } = require('child_process')
const electronReload = require('electron-reload')(['./dist/bundles/**']);
const fs = require('fs')

const {distPath} = require('../../dev/path');

let AnotationProc

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    resizable: true,
    movable: true,
    'webPreferences': {
      'webviewTag': true,
      'preload': `${__dirname}/preload.js`
    },
    // transparent: true,
    // titleBarStyle: 'hidden',
    frame: false,
  });
  mainWindow.loadURL('file://' + distPath.views('/index/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.handle('openFileDialog', async (_, filters) => {
    return await dialog.showOpenDialogSync(mainWindow, { filters: filters ,properties: ['openFile'] });
  })

  ipcMain.handle('openFolderDialog', async () => {
    return await dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] });
  })

  ipcMain.handle('loadAnotationTarget', async (_, anotationName, targetModel, targetDir) => {
    return new Promise((res, rej) => {
      let externalPackagePath = `${__dirname}/../../externalPackage`
      
      if(AnotationProc != undefined) return res({code: 0, mes: 'Anotation processing.'})
      if(anotationName == undefined | anotationName == '') return res({code: 0, mes: 'Empty name.'})
      if(targetModel == undefined | targetModel == '') return res({code: 0, mes: 'Empty target model.'})
      if(targetDir == undefined | targetDir == '') return res({code: 0, mes: 'Empty target directory.'})
      
      AnotationProc = spawn(
        `${externalPackagePath}/main.exe`, 
        [
          `--weights`, `${targetModel}`, 
          `--source`, `${targetDir}`, 
          `--outdir`, `${externalPackagePath}/output`, 
          `--name`, anotationName
        ]
      )

      console.log('START PROC')
  
      AnotationProc.on('close', (code) => {
        console.log(`CLOSED: ${code}`)
        AnotationProc = undefined

        if(code == 0) return res(true)
        else return res({code: 2, mes: `Subproces end at Code: ${code}`})
      })
    })
  })

  ipcMain.handle('getDatabaseInfo', async () => {
    return new Promise((res, rej) => {
      try{
        const databasePath = `${__dirname}/../../externalPackage/output`
        let databases = fs.readdirSync(databasePath)
        let itemsDirBuff
        let movieItemsDirBuff
        let itemPathBuff
        let result = {}

        for(d of databases){
          try{
            databasePathBuff = `${databasePath}/${d}`
            
            if(!fs.statSync(databasePathBuff).isDirectory()) continue

            itemsDirBuff = fs.readdirSync(databasePathBuff)
            result[d] = {}

            for(let i of itemsDirBuff){
              try{
                itemPathBuff = `${databasePathBuff}/${i}`

                if(fs.statSync(itemPathBuff).isDirectory()){
                  movieItemsDirBuff = fs.readdirSync(itemPathBuff)
                  result[d][i] = {}

                  for(m of movieItemsDirBuff){
                    try{
                      if(m.split('.').slice(-1)[0] == 'jpg') result[d][i][m] = `${itemPathBuff}/${m}`
                    }catch(err){continue}
                  }
                }else if(fs.statSync(itemPathBuff).isFile()){
                  if(itemPathBuff.split('.').slice(-1)[0] == 'jpg') result[d][i] = itemPathBuff
                }
              }catch(err){continue}
            }
          }catch(err){continue}
        }

        return res(result)
      }catch(err){
        return rej(err)
      }
    })
  })

  ipcMain.on('exitApp', async () => {
    console.log("exit")
    mainWindow.close();
  })
});
