var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

function defaultContentTypeMiddleware (req, res, next) {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  next();
}

app.use(defaultContentTypeMiddleware);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var expectedString = "Test String";
var goodCount = 0;
var badCount = 0;

app.all('*', function(req, res) {
    try {
        if (req.method === 'PUT' || req.method === 'POST')  {
            var base64data = req.body.data._raw;
            if (base64data === null || base64data === "")    {
                throw "Cannot decode null or empty data";
            }
            var buffer = new Buffer(base64data, 'base64');
            var decodedDataString = buffer.toString();
            console.log('Received string: ' + decodedDataString);
            if (decodedDataString === expectedString) {
                ++goodCount;
            }
            else {
                ++badCount;
            }
            var total = goodCount + badCount;
            var successRate = (goodCount / total) * 100;
            console.log('Success rate: ' + successRate + '%');
        }
        res.send('OK');
    } catch(err) {
        console.log(err);
        res.status(400);
        res.send(err);
    }
});

var port = Number(process.env.PORT || 3000);
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});