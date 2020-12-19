// Module 
const express = require('express');
const path = require('path');
const http = require('http');
const twilio = require('twilio');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(logger('tiny'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') !== 'production') {
  app.use(errorHandler());
}


app.get('/', (request, response) => response.render('index'));


app.post('/call', (request, response) => {
  var client = twilio(accountSid, authToken);

  client.makeCall({

    to:request.body.number,


    from:'+1417308 5593',


    url:'https://pplverf.azurewebsites.net/outbound_call'
  }, () => {

    response.redirect('/');
  });
});


app.post('/outbound_call', (request, response) => {
  var twiml = new twilio.TwimlResponse();

  twiml.say('hello - thanks for checking out Twilio and Azure', {
      voice:'woman'
  });

  response.set('Content-Type', 'text/xml');
  response.send(twiml.toString());
});

app.listen(app.get('port'), function(){
  console.log(`Express server listening on port ${app.get('port')}`);
});
