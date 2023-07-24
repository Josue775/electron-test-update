const { app, BrowserWindow, ipcMain } = require("electron");
const MainScreen = require("./screens/main/mainScreen");
const { autoUpdater } = require("electron-updater");

let curWindow;

// Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  curWindow = new MainScreen();
}

let isUpdateAvailable = false;

function checkForUpdates() {
  autoUpdater.checkForUpdates().then((info) => {
    if (info && info.updateInfo && info.updateInfo.version !== app.getVersion()) {
      isUpdateAvailable = true;
      curWindow.showMessage(`Update available. Current version ${app.getVersion()}`);
    } else {
      isUpdateAvailable = false;
      curWindow.showMessage(`No update available. Current version ${app.getVersion()}`);
    }
  }).catch((error) => {
    curWindow.showMessage(`Error checking for updates: ${error.message}`);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });

  checkForUpdates();
});

ipcMain.on("start-update", () => {
  if (isUpdateAvailable) {
    autoUpdater.downloadUpdate().then((path) => {
      curWindow.showMessage(`Update downloaded. Current version ${app.getVersion()}. Please restart the application to apply the update.`);
      // Add logic to show a "Restart" button or similar to prompt the user to restart the app to apply the update.
    }).catch((error) => {
      curWindow.showMessage(`Error downloading update: ${error.message}. Please check your internet connection and try again.`);
    });
  } else {
    curWindow.showMessage("No update available.");
  }
});

// Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});