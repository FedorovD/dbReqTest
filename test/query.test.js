'use strict';
const assert = require('assert');
const index = require('../index');

const correctResult = require('../result');

describe('query test', function() {
    it('passed', async function(){
        let result = await index;
        assert.equal(JSON.stringify(correctResult),JSON.stringify(result));
    }).timeout(5000);
});