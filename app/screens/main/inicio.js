const { ipcRenderer } = require('electron')

let btnInicio;

window.onload = function() {
  btnInicio = document.getElementById("btnInicio");

  btnInicio.addEventListener('click', function() {
    ipcRenderer.send("inicio");
  });
};
