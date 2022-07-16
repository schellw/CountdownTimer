const { ipcRenderer } = require('electron');
var startTime = new Date();

ipcRenderer.on('loaded', (event, message) => {
    console.log("Recieved Loaded Event");
    let header = document.getElementById("timer");
    header.style.fontSize = message.fontSize;
    header.style.color = message.color;

    incrementTime();
});

function incrementTime() {
    var curTime = new Date();
    var secondsLeft = 60 - curTime.getSeconds();
    let header = document.getElementById("timer");

    if (curTime.getMinutes() > startTime.getMinutes() || curTime.getHours() > startTime.getHours()) {
        secondsLeft = 0;
    }

    if (secondsLeft > 0) {
        header.innerText = secondsLeft;
        setTimeout(incrementTime, 500);
    } else {
        header.innerText = "0";
        setTimeout(closeTheApp, 3000);
    }
}

function closeTheApp() {
    ipcRenderer.send('close-app', 'close-app');
}