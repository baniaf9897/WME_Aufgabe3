// DO NOT CHANGE!
//init app with express, util, body-parser, csv2json
var express = require('express');
var app = express();
var sys = require('util');
var path = require('path');
var bodyParser = require('body-parser');
var Converter = require("csvtojson").Converter;

//register body-parser to handle json from res / req
app.use( bodyParser.json() );

//register public dir to serve static files (html, css, js)
app.use( express.static( path.join(__dirname, "public") ) );

// END DO NOT CHANGE!


/**************************************************************************
****************************** csv2json *********************************
**************************************************************************/
var csv = require('csvtojson');

const csvFilePath = './world_data.csv';
var json;

csv().fromFile(csvFilePath).then(
    (_json) => {
        json = _json;
    }
)
/**************************************************************************
********************** handle HTTP METHODS ***********************
**************************************************************************/


// DO NOT CHANGE!
// bind server to port
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});



app.get('/items', function(req,res){
    res.send(json);
});
app.get('/items/:id',function(req,res){
    var id = Number(req.params.id);

    if(0 <= id && id <= json.length)
        res.send(json[req.params.id - 1]);
    else
        res.status(400).send("No such id " + id + " in database.");
    
});
app.get('/items/:id1/:id2',function(req,res){
    let id1 = Number(req.params.id1);
    let id2 = Number(req.params.id2);

    var range = id2 - id1;

    var answer = [];

    if(range < 0 | id2 >= json.length | id1 <= 0)
        res.status(400).send("Range not possible.");
    else{
        for(var i = 0; i <= range; i++){
            answer.push(json[Number(id1) + i - 1]);
        }
        res.send(answer);
    }
});
app.get('/properties',function(req,res){
    // first get keys from all objects in array and then reduce to object with maximum amount of keys
    var keys = json.map((row) => Object.keys(row)).reduce((max, key) => {
        if(key > max)
            return key
        else
            return max
        , json[0]
    });
    res.send(keys);
});
app.get('/properties/:num',function(req,res){
    var num = Number(req.params.num) - 1;
    var keys = json.map((row) => Object.keys(row)).reduce((max, key) => {
        if(key > max)
            return key
        else
            return max
        , json[0]
    });

    if(num < 0 || num >= keys.length)
        res.status(400).send("No such property available.")

    res.send(keys[num]);
});

app.post('/items',function(req,res){
    console.log("BODY",req.body);
    var country = req.body;
    country.id = ("00" + Number(json.length + 1)).slice(-3);
    json.push(country);
    res.send("Added country"+ country.name +"to list!");
});

app.delete('/items',function(req,res){
    var country = json.pop();
    res.send("Deleted last country " + country.name + " !");
});

app.delete('/items/:id',function(req,res){
    var id = req.param.id - 1;
    if(id < 0 || id >= json.length)
        res.send("No such id "+id+" in database");
    else
    json.splice(id,1);
    res.send("Item "+id+ " deleted successfully.");
});

