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
