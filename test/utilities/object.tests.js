// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    object = require('../../src/utilities/object');

describe('azure-mobile-apps.utilities.object', function () {
    describe('values', function () {
        it('returns values from object', function () {
            expect(object.values({ p1: 'test', p2: 1, p3: true })).to.deep.equal(['test', 1, true]);
            expect(object.values({})).to.deep.equal([]);
        })
    });
});
