'use strict';
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
console.log("Connected correctly to server");

insertDocuments(db, function() {
    db.close();
  });
});


var insertDocuments = function(db, callback) {
    var collection = db.collection('user');
    collection.find({}).toArray(function(err, docs) {
        console.log("Found the following records");
        console.dir(docs);
        callback(docs);
      });
  }

  module.exports = {
    MongoClient: MongoClient
};