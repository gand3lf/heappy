const { app, BrowserWindow } = require('electron')


function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 590,
    minWidth: 700,
    minHeight: 300,
    frame: false,
    title: "HEAPPY :)",
    webPreferences: {
      nodeIntegration: true
    }
  })
  const ses = win.webContents.session.clearCache(function() {
  });
  win.setMenu(null)
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {

    createWindow()
  }
})

