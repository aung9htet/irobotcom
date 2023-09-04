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
  if( event.data.indexOf("speed") > -1){
    window.robotWindow.send(event.data);
  }else if(event.data.indexOf("temperature_gradient") > -1){
    val = event.data.split(",")[1]
    window.robotWindow.send("gradi," + val);
  }else if(event.data.indexOf("temperature_intercept") > -1){
    val = event.data.split(",")[1]
    window.robotWindow.send("inter," + val);
  }
});

