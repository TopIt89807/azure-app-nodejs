// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('./infrastructure/config'),
    execute = require('../../../src/data/sql/execute'),
    index = require('../../../src/data/sql'),
    queries = require('../../../src/query'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sql.integration.softDelete', function () {
    var operations = index(config)({ name: 'softDelete', softDelete: true });

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
        return operations.delete(id, version);
    }

    function undelete(id, version) {
        return operations.undelete(id, version);
    }
});
