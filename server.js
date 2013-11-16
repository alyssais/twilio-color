// load dependencies
var twilio = require("twilio");
var express = require("express.io");

// create the express.io app
var app = express();
app.http().io();

// send client code from the public/ folder
app.use(express.static(process.cwd() + '/public'));

// handle SMS from Twilio
app.get('/twilio/sms', function(req, res) {
  // extract the color from the Twilio request
  var color = req.query.Body.trim();

  console.log(color);

  // prepare the reply to Twilio
  var resp = new twilio.TwimlResponse();

  // check that the color is valid
  if (color.match(/^\#(?:[0-9a-f]{3}){1,2}$/i)) {
    // broadcast the color to all connected browsers
    app.io.broadcast('color', color);
  } else {
    // reply to the SMS, telling the sender that the color is invalid.
    // generate a random example color to show what color format is expected.
    var exampleColor = Math.floor(Math.random() * Math.pow(255, 3)).toString(16);
    resp.message('I didn\'t recognize that color. :(\nTry sending a hex color, like this: "#' + exampleColor + '".');
  }

  // send the reply to Twilio
  res.send(resp.toString());
});

app.listen(7076);
