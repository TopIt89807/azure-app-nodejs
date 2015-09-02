// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var index = require('../../../src/data/sql'),
    execute = require('../../../src/data/sql/execute'),
    queries = require('../../../src/query'),
    config = require('./infrastructure/config'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sql.integration', function () {
    var operations = index(config)({ name: 'integration' });

    beforeEach(function (done) {
        return operations.truncate().then(done);
    });

    it("basic connection test", function () {
        return execute(config, { sql: 'select * from integration', parameters: [] });
    });

    it("basic integration test", function () {
        return insert({ id: '1', string: 'test', bool: false, number: 1.1 })
            .then(function (results) {
                expect(results).to.deep.equal({ id: '1', string: 'test', bool: false, number: 1.1 });
                return read();
            })
            .then(function (results) {
                expect(results).to.deep.equal([{ id: '1', string: 'test', bool: false, number: 1.1 }]);
                return update({ id: '1', string: 'test2', bool: true, number: 2.2  });
            })
            .then(read)
            .then(function (results) {
                expect(results).to.deep.equal([{ id: '1', string: 'test2', bool: true, number: 2.2 }]);
                return del(1);
            })
            .then(read)
            .then(function (results) {
                expect(results.length).to.equal(0);
            });
    });

    it("preserves existing values if unspecified", function () {
        return insert({ id: '1', string: 'test', bool: true, number: 1.1 })
            .then(function () {
                return update({ id: '1', string: 'test2' });
            })
            .then(read)
            .then(function (results) {
                expect(results).to.deep.equal([{ id: '1', string: 'test2', bool: true, number: 1.1 }]);
                return del(1);
            });
    });

    it("returns number of records deleted", function () {
        return insert({ id: '1', string: 'test', bool: true, number: 1.1 })
            .then(function () {
                return del('1');
            })
            .then(function (results) {
                expect(results.recordsAffected).to.equal(1);
                return del('1');
            })
            .then(function (results) {
                expect(results.recordsAffected).to.equal(0);
            });
    });

    function read() {
        return operations.read(queries.create('integration'));
    }

    function insert(item) {
        return operations.insert(item);
    }

    function update(item) {
        return operations.update(item);
    }

    function del(id) {
        return operations.delete(id);
    }
});
