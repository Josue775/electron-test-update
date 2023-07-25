const { app, BrowserWindow, ipcMain, globalShortcut,Notification } = require("electron");
const path = require("path");

class MainScreen {
  window;

  position = {
   
    maximized: false,
  };

  constructor() {
    this.window = new BrowserWindow({
      // width: this.position.width,
      // height: this.position.height,
      width: 900,
      height: 700,
      title: "This is a test application",
      show: false,
      removeMenu: true,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nativeWindowOpen: true,
        webSecurity: true,
        preload: path.join(__dirname, "./mainPreload.js"),
      },
    });

    this.window.once("ready-to-show", () => {
      this.window.show();

      if (this.position.maximized) {
        this.window.maximize();
      }
    });

    this.handleMessages();

    let wc = this.window.webContents;
    wc.openDevTools({ mode: "undocked" });

    this.window.loadFile("./screens/main/main.html");
  }

  showMessage(message) {
    console.log("showMessage trapped");
    console.log(message);
    this.window.webContents.send("updateMessage", message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
  }
}
class InicioScreen {
  window;

  constructor() {
    this.window = new BrowserWindow({
      width: 900,
      height: 700,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nativeWindowOpen: true,
        webSecurity: true,
        preload: path.join(__dirname, './inicio.js')
      }
    });

    this.window.once("ready-to-show", () => {
      this.window.show();
    });

    this.window.loadFile("./screens/main/inicio.html");
  }

  // Aquí puedes agregar métodos y funciones específicas para la ventana de inicio, si es necesario.

  close() {
    this.window.close();
    ipcMain.removeAllListeners(); // Esto puede no ser necesario aquí, depende de tu lógica global de IPC
  }

  hide() {
    this.window.hide();
  }
}
module.exports = { MainScreen, InicioScreen };
