const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require('fs');
const path = require('path');

let mainWindow = null;

app.on('ready', () => {
  const { screen } = require('electron');
  const disp = screen.getPrimaryDisplay();
  const { width, height } = disp.workAreaSize;

  let json = fs.readFileSync(path.resolve(__dirname, 'settings.json'));
  let settings = JSON.parse(json);

  mainWindow = new BrowserWindow({
    width: settings.formWidth,
    height: settings.formHeight,
    x: (width / 2) - settings.formWidth,
    y: height - settings.formHeight,
    frame: settings.showFrame,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile("index.html");
  
  if(settings.showDevTools) mainWindow.webContents.openDevTools();

  mainWindow.webContents.once('did-finish-load', () => {
    console.log("Sending Loaded Event");
    mainWindow.webContents.send('loaded', settings);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on('close-app', (event, message) => {
  console.log("Closing Window");
  mainWindow.close();
});