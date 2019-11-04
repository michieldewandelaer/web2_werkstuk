'use strict'
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID
const assert = require('assert');
const path = require('path');
const app = express()
const bodyParser = require('body-parser');
const port = 3000

let cors = require('cors')

// Connection URL
let user = "MongoDBWeb2055";
let password = "59473128"
const url = `mongodb://${user}:${password}@172.20.0.54:27017/?authMechanism=DEFAULT&authSource=${user}`;


// Create a new MongoClient
const client = new MongoClient(url);

let db;
let collection;

// Use connect method to connect to the Server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    db = client.db(user);
    collection = db.collection('drivers');
});

//Makkelijker cors toelaten
app.use(cors())


/*
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})*/

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/api/getAllDrivers', (req, res) => {
    collection.find().toArray().then(function (data) {
        res.send(data)
    })
});

app.post('/api/insertDriver', (req, res) => {
    let name = req.body.name;
    let number = req.body.number;
    collection.insertOne({
        name,
        number
    });
});

//werkt in postman
//problemen met cors op de browser
app.post('/api/getDriver', (req, res) => {
    var objectId = new ObjectID(req.body.id)
    collection.findOne({
        _id: objectId
    }).then(function (data) {
        console.log(data)
        res.send(data)
    })
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/html/routes.html'))
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))