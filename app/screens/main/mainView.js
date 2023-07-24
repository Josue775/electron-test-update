document.addEventListener("DOMContentLoaded", function () {
  const updateButton = document.getElementById("updateButton");
  updateButton.addEventListener("click", () => {
    window.bridge.startUpdate(); // Call the exposed startUpdate function from the preload script
  });

  window.bridge.updateMessage(updateMessage);
});

// Definir la función startUpdate y exponerla a la ventana principal a través de contextBridge
function startUpdate() {
  // Enviar un mensaje al proceso principal para iniciar la actualización
  window.bridge.send("start-update");
}

function updateMessage(event, message) {
  console.log("message logged in view");
  let elemE = document.getElementById("message");
  elemE.innerHTML = message;

  const updateButton = document.getElementById("updateButton");
  updateButton.disabled = !message.includes("Update available");
}
