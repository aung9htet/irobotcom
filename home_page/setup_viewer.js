let ipInput = null;
let connectButton = null;
let modeSelect = null;
let broadcast = null;

const mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (mobileDevice) {
  let head = document.getElementsByTagName('head')[0];

  let mobileCss = document.createElement('link');
  mobileCss.setAttribute('rel', 'stylesheet');
  mobileCss.setAttribute('type', 'text/css');
  mobileCss.setAttribute('href', 'https://www.cyberbotics.com/wwi/R2023b/css/wwi_mobile.css');
  head.appendChild(mobileCss);
}

function init() {
  console.log("Initializing viewer");
}


function connect() {
  const ipInput = 'http://localhost:1999/session?url=https://github.com/aung9htet/irobotcom/tree/main/home_page/worlds/koala.wbt'
  const defaultThumbnail = 'https://cyberbotics.com/wwi/R2023b/images/loading/default_thumbnail.png';
  const streamingMode = 'x3d' //x3d or mjpeg
  const webotsView = document.getElementsByTagName('webots-view')[0];
  const broadcast = false
  webotsView.onready = onConnect;
  webotsView.ondisconnect = onDisconnect;
  webotsView.connect(ipInput, streamingMode, broadcast, mobileDevice, -1, defaultThumbnail);
  webotsView.showPlay = false
  webotsView.showQuit = false
  webotsView.showReload = false
  webotsView.showReset = false
  webotsView.showRobotWindow = false
  webotsView.showWorldSelection = false
}

function onConnect() {
  console.log("Connection successful with the simulation server")
}

function onDisconnect() {
  console.log("Disconnecting from simulation server")
}

function disconnect() {
  document.getElementsByTagName('webots-view')[0].close();
}

function start(){
  const webotsView = document.getElementsByTagName('webots-view')[0];
  webotsView.sendMessage("real-time:-1")
}

function pause(){
  const webotsView = document.getElementsByTagName('webots-view')[0];
  webotsView.sendMessage("pause")
}

function sendToRobot( message ){
  const webotsView = document.getElementsByTagName('webots-view')[0];
  webotsView.toolbar.robotWindows[0].frame.contentWindow.postMessage(message, "*");
}

init();
toggle = 1

window.addEventListener("mouseup", (event) => {
  const webotsView = document.getElementsByTagName('webots-view')[0];
  
  if( toggle == 1 ){
    webotsView.sendMessage("real-time:-1")
  }else
    webotsView.sendMessage("pause")

  toggle = -1*toggle

});

window.addEventListener("message", (event) => {
  console.log("Data received parent: " + event.data);
  if (event.data == "reset") {
    connect();
  } else if( event.data == "start"){
    start()
  } else if( event.data == "pause"){
    pause()
  } else if( event.data.indexOf("data") > -1){
    parent.postMessage(event.data, "*");   
  }else{
    sendToRobot( event.data );
  }
});
