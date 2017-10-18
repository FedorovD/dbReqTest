'use strict';
var assert = require('assert');
var index = require('../index');
it.optional = require('../extensions/it-optional');

describe('index', function() {
    it.optional('test failed', function() {
        assert.equal({
        }, index.MongoClient());
    });
});