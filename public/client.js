// connect to the websocket
var socket = io.connect();

// listen for new colors from the server
socket.on('color', function(color) {
	// update the background color
  document.body.style.backgroundColor = color;
});
