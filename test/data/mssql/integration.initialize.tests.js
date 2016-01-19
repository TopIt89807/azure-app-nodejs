// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('../../appFactory').configuration().data,
    data = require('../../../src/data')({ data: config }),
    execute = require('../../../src/data/mssql/execute'),
    expect = require('chai').use(require('chai-subset')).expect;

describe('azure-mobile-apps.data.sql.integration.initialize', function () {
    afterEach(function (done) {
        execute(config, { sql: 'drop table dbo.initialize' }).then(done, done);
    });

    it('creates non-dynamic tables', function () {
        var table = definition({ string: 'string', number: 'number' });
        return table.initialize()
            .then(function () {
                return table.insert({ id: '1' });
            })
            .then(function (inserted) {
                expect(inserted.string).to.be.null;
                expect(inserted.number).to.be.null;
            })
    });

    it('updates non-dynamic tables', function () {
        var table = definition({ string: 'string', number: 'number' });
        return table.initialize()
            .then(function () {
                return table.insert({ id: '1' });
            })
            .then(function (inserted) {
                expect(inserted.string).to.be.null;
                expect(inserted.number).to.be.null;
                table = definition({ string: 'string', number: 'number', boolean: 'boolean' });
                return table.initialize();
            })
            .then(function () {
                return table.read();
            })
            .then(function (results) {
                expect(results.length).to.equal(1);
                expect(results[0].boolean).to.be.null;
            });
    });

    it('seeds data on initialize', function () {
        var table = definition({ string: 'string' }, [{ id: '1' }, { id: '2', string: 'test2' }]);
        return table.initialize()
            .then(function () {
                return table.read();
            })
            .then(function (results) {
                expect(results.length).to.equal(2);
                expect(results[0]).to.containSubset({ id: '1', string: null });
                expect(results[1]).to.containSubset({ id: '2', string: 'test2' });
            });
    });

    it('seeds data on initialize for dynamicSchema tables', function () {
        var table = definition({ string: 'string' }, [{ id: '1' }, { id: '2', string: 'test2' }], true);
        return table.initialize()
            .then(function () {
                return table.read();
            })
            .then(function (results) {
                expect(results.length).to.equal(2);
                expect(results[0]).to.containSubset({ id: '1', string: null });
                expect(results[1]).to.containSubset({ id: '2', string: 'test2' });
            });
    });

    it('constructs schema from seeded data for dynamicSchema tables', function () {
        var table = definition(undefined, [{ id: '1' }, { id: '2', string: 'test2' }], true);
        return table.initialize()
            .then(function () {
                return table.read();
            })
            .then(function (results) {
                expect(results.length).to.equal(2);
                expect(results[0]).to.containSubset({ id: '1', string: null });
                expect(results[1]).to.containSubset({ id: '2', string: 'test2' });
            });
    });

    function definition(columns, seed, dynamicSchema) {
        return data({ name: 'initialize', dynamicSchema: dynamicSchema || false, columns: columns, seed: seed });
    }
});
