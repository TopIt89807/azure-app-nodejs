// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('./infrastructure/config'),
    data = require('../../../src/data')({ data: config }),
    execute = require('../../../src/data/sql/execute'),
    expect = require('chai').expect;

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

    function definition(columns) {
        return data({ name: 'initialize', dynamicSchema: false, columns: columns });
    }
});
