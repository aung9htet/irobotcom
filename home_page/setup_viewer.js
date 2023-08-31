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
  connectButton = document.getElementById('connect-button');

  connectButton.onclick = connect;
}

function connect() {
  const ipInput = 'http://localhost:1999/session?url=https://github.com/cyberbotics/webots-cloud-simulation-examples/blob/main/6_binary/worlds/ned.wbt'
  const defaultThumbnail = 'https://cyberbotics.com/wwi/R2023b/images/loading/default_thumbnail.png';
  const streamingMode = 'x3d' //x3d or mjpeg
  const webotsView = document.getElementsByTagName('webots-view')[0];
  const broadcast = false
  webotsView.onready = onConnect;
  webotsView.ondisconnect = onDisconnect;
  webotsView.connect(ipInput, streamingMode, broadcast, mobileDevice, -1, defaultThumbnail);

  connectButton.disabled = true;
}

function onConnect() {
  connectButton.value = 'Disconnect';
  connectButton.onclick = disconnect;
  connectButton.disabled = false;
}

function onDisconnect() {
  connectButton.value = 'Connect';
  connectButton.onclick = connect;

  connectButton.disabled = false;
}

function disconnect() {
  document.getElementsByTagName('webots-view')[0].close();
}

init();
