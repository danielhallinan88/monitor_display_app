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
function getWeather(type) {
  var myData     = JSON.parse(data);
  var myCurrent  = JSON.parse(current);
  var myForecast = JSON.parse(forecast)

  //console.log(myData);
  // Example: https://api.openweathermap.org/data/2.5/weather?q=Madison&units=imperial&APPID=d3a1c67a45b3fbaa8cbc44134f4f7eb8
  var url_base = 'https://api.openweathermap.org/data/2.5/' + type + '?q=' + myData['city'];
  url_base    += '&units=' + myData['units'] + '&APPID=' + myData['key'];
  //console.log(url_base);

  //console.log(myForecast);
  var temp = myForecast['list'][0]['main']['temp'];
  //console.log(temp);

  return temp;
  //document.getElementById('current_temp').innerHTML = temp;
}

function timedRefresh(timeoutPeriod) {
  setTimeout("location.reload(true);", timeoutPeriod);
}

window.onload = timedRefresh(360000);

window.onload = function(){
    var temp = getWeather('forecast');
    //console.log(temp);
    document.getElementById('current_temp').innerHTML = Math.round(temp) + "°F";
};
//console.log(current);
