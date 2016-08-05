/**
 * This is an example tiForms backend server. It exemplifies how the 
 * encrypted form submitted by the browser can be further passed to 
 * the tiCrypt server.
 * 
 * The server requires the user to provide a configuration file, 
 * config.json (produced by tiCrypt interface) of the form:
 * {
 *      "port": 3000,
 * }
 */
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var config = require('./config.json');

var crypto = require('crypto');
var tiForms = require('../../dist/server.js');

var decryptor = undefined; // uninitialized decryptor

app.use( bodyParser.json()); 

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/tiForms.js', function (req, res) {
    res.sendFile(__dirname + '/tiForms.js');
});

app.post('/setkey', function(req, res){
    var privKey = req.body.privKey;
    console.log("Private Key:", privKey);
    decryptor = new tiForms.Decryptor(privKey);
    res.send("OK");
});

app.post('/submit', function (req, res) {
    console.log("Data submitted:", req.body);
    var encriptedPair = {
        pubKey: req.body.pubKey,
        payload: req.body.payload
    }

    if (decryptor){
        var obj = undefined;
        try {
            var dec = decryptor.decryptString(encriptedPair);
            obj = JSON.parse(dec);
        } catch(e){
            console.error("Decryption failed: ", e);
        }
        console.log("Submitted: ", obj);
        res.status(200).send("OK");
    } else {
        console.error("Decryptor not ready.");
        res.status(401).send("Decryptor not ready");
    }
});

app.listen(config.port, function () {
    console.log('tiForms Server listening on port ' + config.port);
});

