import RobotWindow from 'https://cyberbotics.com/wwi/R2023b/RobotWindow.js';

window.onload = function() {
  window.robotWindow = new RobotWindow();

  window.robotWindow.receive = function(message, robot) { 
    // Receiving temperature and relaying it
    // console.log("Received at robowindow: " + message)
    parent.postMessage(message, "*");   
  }
  window.robotWindow.send("configure");
}


window.addEventListener("message", (event) => {
  console.log("Data received koala: " + event.data);
  console.log("Recepcion de datos: " + event.data);
  window.robotWindow.send(event.data);
});

