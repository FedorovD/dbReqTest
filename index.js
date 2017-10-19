'use strict';
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/truvoice_test';

const queryReq = require('./queryReq');

module.exports = MongoClient.connect(url)
    .then(db => {
        return db
    })
    .then(db => {
        let res = query(db).toArray();
        db.close();
        return res;
    })
    .catch(e => console.error(e));


function query(db) {
    return db.collection('opportunities').aggregate(queryReq);
}