/**
 * This is an example tiForms backend server. It exemplifies how the 
 * encrypted form submitted by the browser can be further passed to 
 * the tiCrypt server.
 * 
 * The server requires the user to provide a configuration file, 
 * config.json (produced by tiCrypt interface) of the form:
 * {
 *      "formPubKey": "dilNHCCWN2DohInQm2HyizTmR5W1f97wk4oZxDLrFPg|M8MrUMaKOTXQbJow5V5payQcnlVStpY3nAU3plM7Fnk",
 *      "formID": "4231234231451241234723482038",
 *      "apiKey": "7985201962453834871283471",
 *      "port": 3000,
 *      "backendUrl": "https://tiCrypt.mydomain.com"" 
 * }
 */
var unirest = require('unirest');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var config = require('./config.json');

app.use( bodyParser.json()); 

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/tiForms.js', function (req, res) {
    res.sendFile(__dirname + '/tiForms.js');
});

app.get('/config.js', function (req, res) {
    res.send("var formPublicKey='" + config.formPubKey + "';\n");
});

app.post('/submit', function (req, res) {
    console.log("Data submitted:", req.body);
    unirest.post(config.backendUrl)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .send({
            payload: req.body.payload,
            pubKey: req.body.pubKey,
            formID: config.formID,
            apiKey: config.apiKey
        })
        .end(function (response) {
            console.log(response);
            if (response.error){
                res.status(404).send("Submission failed");
            } else {
                res.send(response.body);
            }
        });

});

app.listen(config.port, function () {
    console.log('tiForms Server listening on port ' + config.port);
});

