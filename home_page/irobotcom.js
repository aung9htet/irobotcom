class DataStorage{
    constructor(){
        this.temperature = null;
        this.temperature_gradient = 1;
        this.temperature_intercept = 1;
        this.speed = 0;
    }

    set_data(temperature){
        this.temperature = str(temperature);
    }
}

// send messages over to iframe
const listenerSpeedChannel = new BroadcastChannel('speed');
listenerSpeedChannel.onmessage = (msg) => {
  webotsView.toolbar.robotWindows[0].frame.contentWindow.postMessage("speed," + msg.data, "*");
};
const listenerGradientChannel = new BroadcastChannel('temperature_gradient');
listenerGradientChannel.onmessage = (msg) => {
  document.getElementById("simulator").contentWindow.postMessage("temperature_gradient," + msg.data, "*");
};
const listenerInterceptChannel = new BroadcastChannel('temperature_intercept');
listenerInterceptChannel.onmessage = (msg) => {
  document.getElementById("simulator").contentWindow.postMessage("temperature_intercept," + msg.data, "*");
};
const listenerResetChannel = new BroadcastChannel('control');
listenerResetChannel.onmessage = (msg) => {
  document.getElementById("simulator").contentWindow.postMessage(msg.data, "*");
};



//init class
var data_store = new DataStorage();

// receive messages from iframe
window.addEventListener("message", (event) => {
  const command = event.data.split(",")[0];
  if( command == "data" ){
    var temperature = (event.data.split(",")[1]);
    (async function() {
      const result = await google.colab.kernel.invokeFunction(
        'notebook.Run', // The callback name.
        [temperature], // The arguments.
        {}); // kwargs
    })();
  }
});