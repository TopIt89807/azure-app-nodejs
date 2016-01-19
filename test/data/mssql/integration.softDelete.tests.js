// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('../../appFactory').configuration().data,
    execute = require('../../../src/data/mssql/execute'),
    index = require('../../../src/data/mssql'),
    queries = require('../../../src/query'),
    expect = require('chai').expect,
    operations;

describe('azure-mobile-apps.data.sql.integration.softDelete', function () {
    before(function () {
        operations = index(config)({ name: 'softDelete', softDelete: true });
    });

    afterEach(function (done) {
        execute(config, { sql: 'drop table dbo.softDelete' }).then(done, done);
    });

    it('deleted records are not returned with normal query', function () {
        return insert({ id: '1' })
            .then(function () {
                return del('1');
            })
            .then(function () {
                return read();
            })
            .then(function(results) {
                expect(results.constructor).to.equal(Array);
                expect(results.length).to.equal(0);
            });
    });

    it('deleted records are returned when requested', function () {
        return insert({ id: '1' })
            .then(function () {
                return del('1');
            })
            .then(function () {
                return read(true);
            })
            .then(function(results) {
                expect(results.constructor).to.equal(Array);
                expect(results.length).to.equal(1);
            });
    });

    it('deleted records can be undeleted', function () {
        return insert({ id: '1' })
            .then(function () {
                return del('1');
            })
            .then(function () {
                return undelete('1');
            })
            .then(function () {
                return read();
            })
            .then(function(results) {
                expect(results.constructor).to.equal(Array);
                expect(results.length).to.equal(1);
            });
    });

    function read(includeDeleted) {
        var query = queries.create('softDelete');
        query.includeDeleted = includeDeleted;
        return operations.read(query);
    }

    function insert(item) {
        return operations.insert(item);
    }

    function update(item) {
        return operations.update(item);
    }

    function del(id, version) {
        var query = queries.create('integration').where({ id: id });
        if(version)
            query.where({ version: version });
        return operations.delete(query);
    }

    function undelete(id, version) {
        var query = queries.create('integration').where({ id: id });
        if(version)
            query.where({ version: version });
        return operations.undelete(query, version);
    }
});
