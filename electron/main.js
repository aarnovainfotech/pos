const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// 🔒 Prevent multiple app instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

function startBackend() {
  if (backendProcess) return;

  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'server.js')
    : path.join(__dirname, '..', 'backend', 'server.js');

  backendProcess = spawn(process.execPath, [backendPath], {
    stdio: 'ignore'
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true
    }
  });

  const indexPath = app.isPackaged
    ? path.join(process.resourcesPath, 'frontend', 'index.html')
    : path.join(__dirname, '..', 'frontend', 'dist', 'index.html');

  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('before-quit', () => {
  if (backendProcess) backendProcess.kill();
});
