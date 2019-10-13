var span = document.getElementById('clock');

function add_zero_str(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

function time() {
  var d = new Date();
  var s = add_zero_str(d.getSeconds());
  var m = add_zero_str(d.getMinutes());
  var h = d.getHours();
  span.textContent = h + ":" + m + ":" + s;
}

setInterval(time, 1000);


var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }

  document.getElementById("fullScreenButton").style.display="none";
}

// Weather
// DOCS: https://openweathermap.org/current
var mydata = JSON.parse(data);
console.log(mydata['city']);
