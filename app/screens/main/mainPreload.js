const { contextBridge, ipcRenderer } = require("electron");

let bridge = {
  updateMessage: (callback) => ipcRenderer.on("updateMessage", callback),
  startUpdate: () => ipcRenderer.send("start-update"), // Expose the startUpdate function to the main view
};

contextBridge.exposeInMainWorld("bridge", bridge);