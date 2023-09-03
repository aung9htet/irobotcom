
import RobotWindow from 'https://cyberbotics.com/wwi/R2023b/RobotWindow.js';

window.onload = function() {
    window.robotWindow = new RobotWindow();
    console.log(window.robotWindow)
}

function turn_speed( val ){
    console.log("Turn speed");

    const webotsView = document.getElementsByTagName('webots-view')[0];


    webotsView.sendMessage("Hello")
}



function speed( val ){
    console.log("Speed");
}



function change_temperature( val ){
    console.log("Changing the temperature");
}



function change_intecept( val ){
    console.log("Changing intercept");
}