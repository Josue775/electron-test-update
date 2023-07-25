const { app, BrowserWindow, ipcMain ,Notification} = require("electron");
const { MainScreen, InicioScreen } = require("./screens/main/mainScreen");
const { autoUpdater } = require("electron-updater");
const http = require('http');
let mainScreen;
let inicioScreen;
let isUpdateAvailable = false;

// Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createMainWindow() {
  
  mainScreen = new MainScreen();
  
}

function createInicioWindow() {
  inicioScreen = new InicioScreen();
}
app.whenReady().then(() => {
  showInternetStatus();
  createInicioWindow(); // Crear la ventana de inicio al iniciar la aplicación
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
function checkForUpdates() {
  autoUpdater.checkForUpdates().then((info) => {
    if (info && info.updateInfo && info.updateInfo.version !== app.getVersion()) {
      isUpdateAvailable = true;
      mainScreen.showMessage(`Update available. Current version ${app.getVersion()}`);
    } else {
      isUpdateAvailable = false;
      mainScreen.showMessage(`No update available. Current version ${app.getVersion()}`);
    }
  }).catch((error) => {
    mainScreen.showMessage(`Error checking for updates: ${error.message}`);
  });
}


ipcMain.on('inicio', () => {
  const isValid = validaInicio();
  if (isValid) {
    showInternetStatus();
    createMainWindow();
    inicioScreen.close();
    checkForUpdates();
  }
});

function validaInicio() {
  return true;
}
ipcMain.on("start-update", () => {
  if (isUpdateAvailable) {
    autoUpdater.downloadUpdate().then((path) => {
      mainScreen.showMessage(`Update downloaded. Current version ${app.getVersion()}. Please restart the application to apply the update.`);
      // Agrega lógica para mostrar un botón "Restart" o similar para reiniciar la aplicación y aplicar la actualización.
    }).catch((error) => {
      mainScreen.showMessage(`Error downloading update: ${error.message}. Please check your internet connection and try again.`);
    });
  } else {
    mainScreen.showMessage("No update available.");
  }
});

// Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});
function checkInternetStatus(callback) {
  http
    .get('http://www.google.com', (res) => {
      callback(true);
    })
    .on('error', () => {
      callback(false);
    });
}

function showInternetStatus() {
  checkInternetStatus((isOnlineStatus) => {
    const message = isOnlineStatus ? 'Estás conectado a internet.' : 'No estás conectado a internet.';

    const notification = new Notification({
      title: 'Estado de Conexión',
      body: message
    });

    notification.show();

    // Cerrar la notificación después de 5 segundos (5000 ms)
    setTimeout(() => {
      notification.close();
    }, 3000);
  });
}
// app.on("window-all-closed", function () {
//   if (process.platform !== "darwin") app.quit();
// });
