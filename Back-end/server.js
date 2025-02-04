'use strict'
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const assert = require('assert');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const request = require('request');


let cors = require('cors')

// Connection URL
let user = "MongoDBWeb2055";
let password = "59473128"
const url = `mongodb://${user}:${password}@172.20.0.54:27017/?authMechanism=DEFAULT&authSource=${user}`;

// Create a new MongoClient
const client = new MongoClient(url);

let db;

// Use connect method to connect to the Server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    db = client.db(user);
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
    //misschien op true
}));

app.use(bodyParser.json());

app.get('/api/getAllDrivers', (req, res) => {
    let collection = db.collection('drivers');
    collection.find().toArray().then(function (data) {
        res.send(data)
    })
});

app.post('/api/insertDriver', (req, res) => {
    let collection = db.collection('drivers');
    let fname = req.body.fname;
    let lname = req.body.lname;
    let dnumber = req.body.dnumber;
    let year = req.body.year;
    let team = req.body.team;
    collection.insertOne({
        fname,
        lname,
        dnumber,
        year,
        team
    });
});

app.delete('/api/deleteDriver', (req, res) => {
    let collection = db.collection('drivers');
    let objectId = new ObjectID(req.body.id)
    collection.deleteOne({
        _id: objectId
    }).then(function (data) {
        res.send('deleted!')
    });
})

app.post('/api/updateDriver', (req, res) => {
    let collection = db.collection('drivers');
    let objectId = new ObjectID(req.body.id)
    collection.updateOne({
        _id: objectId
    }, {
        $set: {
            fname: req.body.fname,
            lname: req.body.lname,
            dnumber: req.body.dnumber,
            year: req.body.year,
            team: req.body.team
        }
    }).then(function (data) {
        res.send('driver updated')
    })
})

app.get('/api/getDriver', (req, res) => {
    let collection = db.collection('drivers');
    let objectId = new ObjectID(req.body.id)
    console.log(objectId)
    collection.findOne({
        _id: objectId
    }).then(function (data) {
        console.log(data)
        res.send(data)
    })
});

// app.get('/api/2019/Drivers', (req, res) => {
//     request('http://ergast.com/api/f1/2019/drivers.json', {
//         json: true
//     }, (err, res, body) => {})
// })

//------------BONUS--------------//
app.post('/api/myRaces', (req, res) => {
    let collection = db.collection('drivenRaces');
    let data = JSON.parse(req.body.raceData)
    collection.insertOne(data)
})

//------------BONUS--------------//
app.get('/api/getMyRaces', (req, res) => {
    let collection = db.collection('drivenRaces');
    collection.find().toArray().then(function (data) {
        res.send(data)
    })

})

//------------BONUS--------------//
app.post('/api/getRaceResult', (req, res) => {
    let collection = db.collection('drivenRaces');
    let objectId = new ObjectID(req.body.id)
    collection.findOne({
        _id: objectId
    }).then(function (data) {
        //console.log(data)
        res.send(data)
    })
});




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/html/routes.html'))
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))