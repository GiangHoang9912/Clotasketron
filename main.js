const { app, BrowserWindow } = require('electron');


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    center: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.maximize();

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents
      .executeJavaScript(`
      
    
      `)
    mainWindow.show()
  })


  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})