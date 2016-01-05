// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('./infrastructure/config'),
    schema = require('../../../src/data/mssql/schema')(config),
    statements = require('../../../src/data/mssql/statements'),
    queries = require('../../../src/query'),
    execute = require('../../../src/data/mssql/execute'),
    expect = require('chai')
        .use(require('chai-subset'))
        .use(require('chai-as-promised'))
        .expect,
    table = { name: 'schemaTest', seed: [{ id: '1' }, { id: '2' }] };

describe('azure-mobile-apps.data.sql.integration.schema', function () {
    // schema was refactored out of dynamicSchema. Most of the functionality is tested by the dynamicSchema tests.
    afterEach(function (done) {
        execute(config, { sql: 'drop table dbo.schemaTest' }).then(done, done);
    });

    it("initialize creates table and seeds", function () {
        return schema.initialize(table)
            .then(function () {
                return execute(config, statements.read(queries.create('schemaTest')));
            })
            .then(function (results) {
                expect(results.length).to.equal(2);
            })
    });

    it("initialize handles existing tables", function () {
        return schema.initialize(table)
            .then(function () {
                return schema.initialize(table);
            })
            .then(function () {
                return execute(config, statements.read(queries.create('schemaTest')));
            })
            .then(function (results) {
                expect(results.length).to.equal(2);
            })
    });
});
