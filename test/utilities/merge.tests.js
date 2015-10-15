// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').expect,
    merge = require('../../src/utilities/merge');

describe('azure-mobile-apps.utilities.merge', function () {
    it('should throw when target is not an object', function () {
        expect(function () { merge(null); }).to.throw(TypeError);
        expect(function () { merge(undefined); }).to.throw(TypeError);
    });

    it('should merge own enumerable properties from source to target object', function () {
        expect(merge({ foo: 0 }, { bar: 1 })).to.deep.equal({ foo: 0, bar: 1 });
        expect(merge({ foo: 0 }, null, undefined)).to.deep.equal({ foo: 0 });
        expect(merge({ foo: 0 }, null, undefined, { bar: 1 }, null)).to.deep.equal({ foo: 0, bar: 1 });
    });

    it('should not throw on null/undefined sources', function () {
        expect(function () { merge({}, null); }).to.not.throw;
        expect(function () { merge({}, undefined); }).to.not.throw;
        expect(function () { merge({}, undefined, null); }).to.not.throw;
    });

    it('should support multiple sources', function () {
        expect(merge({ foo: 0 }, { bar: 1 }, { bar: 2 })).to.deep.equal({ foo: 0, bar: 2 });
        expect(merge({}, {}, { foo: 1 })).to.deep.equal({ foo: 1 });
    });

    it('should only iterate own keys', function () {
        var Type = function () { };
        Type.prototype.value = 'test';
        var instance = new Type();
        instance.bar = 1;

        expect(merge({ foo: 1 }, instance)).to.deep.equal({ foo: 1, bar: 1 });
    });

    it('should return the modified target object', function () {
        var target = {},
            returned = merge(target, { a: 1 });
        expect(returned).to.equal(target);
    });

    it('should merge values recursively', function() {
        var target = { a: { one: 1 } };
        expect(merge(target, { a: { two: 2 } })).to.deep.equal({ a: { one: 1, two: 2 } });
    });

    it('should treat functions as objects', function () {
        var func = (function () {}).toString();

        var merged = merge(function () {}, { a: 1 });
        expect(merged.toString()).to.equal(func);
        expect(merged.a).to.equal(1);

        merged = merge({ a: 1 }, function () {});
        expect(merged.toString()).to.equal(func);
        expect(merged.a).to.equal(1);

        merged = merge({ a: function () {}}, { a: { b: 1 }});
        expect(merged.a.toString()).to.equal(func);
        expect(merged.a.b).to.equal(1);

        merged = merge({ a: { b: 1 }}, { a: function () {}});
        expect(merged.a.toString()).to.equal(func);
        expect(merged.a.b).to.equal(1);
    });
})
