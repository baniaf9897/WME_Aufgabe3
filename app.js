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
    //send all entries from json
    res.send(json);
});
app.get('/items/:id',function(req,res){
    //read id from url
    var id = Number(req.params.id);
    //filter json for country with same id
    var country = json.filter((el) => el.id == parseId(id))[0];
    //error handling | send correct country
    if(country == undefined)
        res.status(400).send("No such id " + id + " in database.");
    else
        res.send(json[json.indexOf(country)]);
    
});
app.get('/items/:id1/:id2',function(req,res){
    //read ids from url
    let id1 = Number(req.params.id1);
    let id2 = Number(req.params.id2);
    // calculate range
    var range = id2 - id1;
    
    var answer = [];
    //error handling | filter json for countries, which are within the range
    if(range < 0 | id2 >= json.length | id1 <= 0)
        res.status(400).send("Range not possible.");
    else{
        for(var i = 0; i <= range; i++){
            var country = json.filter((el) => el.id == parseId(id1 + i))[0];
            if(country !== undefined)
                answer.push(json[json.indexOf(country)]);
        }
        res.send(answer);
    }
});
app.get('/properties',function(req,res){
     //filter json for object with maximum amount of properties  
    var max = json.reduce((max, key) => {
        if(key.length > max.length)
            return key
        else
            return max
        , json[0]
    });
    //send all keys of this object
    res.send(Object.keys(max));
});
app.get('/properties/:num',function(req,res){
    //get id from url
    var num = Number(req.params.num) - 1;
    //filter json for object with maximum amount of properties
    var max = json.reduce((max, key) => {
        if(key.length > max.length)
            return key
        else
            return max
        , json[0]
    });
    //error handling
    if(num < 0 || num >= keys.length)
        res.status(400).send("No such property available.")
    //send correct property
    res.send(Object.keys(max[num]));
});

app.post('/items',function(req,res){
    //read data from request
    var country = req.body;
    //create correct id format
    country.id = parseId(json.length + 1);
    //add new country into array
    json.push(country);
    res.send("Added country "+ country.name +" to list!");
});

app.delete('/items',function(req,res){
    //deletes last index in json and returns deleted country
    var country = json.pop();
    res.send("Deleted last country " + country.name + " !");
});

app.delete('/items/:id',function(req,res){
    //first get id from url
    var id = req.params.id;
    //filter json for country with same ID
    var country = json.filter((el) => el.id == parseId(id))[0];
    //if country exist => delete it from array, otherwise return with status 400
    if(country == undefined)
        res.status(400).send("No such id "+id+" in database");
    else{
        
        json.splice(json.indexOf(country),1);
        res.send("Item "+country.name+ " deleted successfully.");
    }
});

//helper function for converting number into ID format
function parseId(id){
    return ("00" + id).slice(-3);
}