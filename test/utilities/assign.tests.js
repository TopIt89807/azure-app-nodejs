// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').expect,
    assign = require('../../src/utilities/assign');

describe('azure-mobile-apps.utilities.assign', function () {
    it('should throw when target is not an object', function () {
        expect(function () { assign(null); }).to.throw(TypeError);
        expect(function () { assign(undefined); }).to.throw(TypeError);
    });

    it('should assign own enumerable properties from source to target object', function () {
        expect(assign({ foo: 0 }, { bar: 1 })).to.deep.equal({ foo: 0, bar: 1 });
        expect(assign({ foo: 0 }, null, undefined)).to.deep.equal({ foo: 0 });
        expect(assign({ foo: 0 }, null, undefined, { bar: 1 }, null)).to.deep.equal({ foo: 0, bar: 1 });
    });

    it('should not throw on null/undefined sources', function () {
        expect(function () { assign({}, null); }).to.not.throw;
        expect(function () { assign({}, undefined); }).to.not.throw;
        expect(function () { assign({}, undefined, null); }).to.not.throw;
    });

    it('should support multiple sources', function () {
        expect(assign({ foo: 0 }, { bar: 1 }, { bar: 2 })).to.deep.equal({ foo: 0, bar: 2 });
        expect(assign({}, {}, { foo: 1 })).to.deep.equal({ foo: 1 });
    });

    it('should only iterate own keys', function () {
        var Type = function () { };
        Type.prototype.value = 'test';
        var instance = new Type();
        instance.bar = 1;

        expect(assign({ foo: 1 }, instance)).to.deep.equal({ foo: 1, bar: 1 });
    });

    it('should return the modified target object', function () {
        var target = {},
            returned = assign(target, { a: 1 });
        expect(returned).to.equal(target);
    });

    it('should assign values recursively', function() {
        var target = { a: { one: 1 } };
        expect(assign(target, { a: { two: 2 } })).to.deep.equal({ a: { one: 1, two: 2 } });
    });
})
