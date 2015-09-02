// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var index = require('../../../src/data/sql'),
    queries = require('../../../src/query'),
    config = require('./infrastructure/config'),
    expect = require('chai').expect,
    operations = index(config)({ name: 'query' });

describe('azure-mobile-apps.data.sql.integration.query', function () {
    it("supports equality hashes", function () {
        return operations.read(queries.create('query').where({ number: 1 }))
            .then(function (results) {
                expect(results).to.deep.equal([{ bool: true, id: '1', number: 1, string: 'one' }]);
            });
    });

    it("supports filter functions", function () {
        return operations.read(queries.create('query').where(function () { return this.number == 2 }))
            .then(function (results) {
                expect(results).to.deep.equal([{ bool: false, id: '2', number: 2, string: 'two' }]);
            });
    });

    it("supports OData expressions", function () {
        return operations.read(queries.create('query').where('number eq 3'))
            .then(function (results) {
                expect(results).to.deep.equal([{ bool: true, id: '3', number: 3, string: 'three' }]);
            });
    });

    it("selects columns", function () {
        return operations.read(queries.create('query').where({ number: 1 }).select('id, string'))
            .then(function (results) {
                expect(results).to.deep.equal([{ id: '1', string: 'one' }]);
            });
    });

    it("returns total count if requested", function () {
        return operations.read(queries.create('query').where('number eq 3').includeTotalCount())
            .then(function (results) {
                expect(results).to.deep.equal({
                    results: [{ bool: true, id: '3', number: 3, string: 'three' }],
                    count: 1
                });
            });
    });

    it("returns total count for filter", function () {
        return operations.read(queries.create('query').take(1).includeTotalCount())
            .then(function (results) {
                expect(results).to.deep.equal({
                    results: [{ bool: true, id: '1', number: 1, string: 'one' }],
                    count: 6
                });
            });
    });
});
