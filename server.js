// load dependencies
var twilio = require("twilio");
var express = require("express.io");
var shared = require("./public/shared");

var authToken = process.env.AUTH_TOKEN || require("fs").readFileSync("authtoken.txt").toString().trim();

// create the express.io app
var app = express();
app.http().io();

var lastColor;

app.use(express.bodyParser());

// send client code from the public/ folder
app.use(express.static(process.cwd() + '/public'));

// handle input
app.post('/hook', function(req, res) {

  // extract the color from the request
  var color = (req.body.Body || req.body.text).toLowerCase().replace(/\s/g, "");

  console.log(color);

  // prepare the reply to Twilio
  var resp = new twilio.TwimlResponse();
  
  // broadcast the color to all connected browsers
  app.io.broadcast('color', color);
  lastColor = color;

  // send the reply to Twilio
  // SendGrid will just ignore the reply
  res.send(resp.toString());
});

app.io.route('ready', function(req) {
  if (lastColor)
    req.io.emit('color', lastColor);
});

app.listen(process.env.PORT || 7076);
