// load dependencies
var twilio = require("twilio");
var express = require("express.io");
var shared = require("./public/shared");

var authToken = require("fs").readFileSync("authtoken.txt").toString().trim();

// create the express.io app
var app = express();
app.http().io();

var lastColor;

// send client code from the public/ folder
app.use(express.static(process.cwd() + '/public'));

// handle SMS from Twilio
app.get('/twilio/sms', function(req, res) {
  if (!twilio.validateExpressRequest(req, authToken)) {
    console.log("We got a baddy");
    res.send("Nice try.");
    return;
  }

  // extract the color from the Twilio request
  var color = req.query.Body.toLowerCase().replace(/\s/g, "");

  console.log(color);

  // prepare the reply to Twilio
  var resp = new twilio.TwimlResponse();
  
  // broadcast the color to all connected browsers
  app.io.broadcast('color', color);
  lastColor = color;

  // send the reply to Twilio
  res.send(resp.toString());
});

app.io.route('ready', function(req) {
  if (lastColor)
    req.io.emit('color', lastColor);
});

app.listen(7076);
