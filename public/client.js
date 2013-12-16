// connect to the websocket
var socket = io.connect();

var validColor = function (color) {
  var elem = document.createElement("div");
  elem.style.color = color;
  return !!elem.style.color;
};

var showExample = function() {
  document.getElementById("example").innerHTML = randomColor();
};

setInterval(showExample, 5000);
showExample();

// listen for new colors from the server
socket.on('color', function(color) {
  console.log(color);

  document.body.style.backgroundColor = validColor(color) ? color : randomColor();
});

socket.emit('ready');
