// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var index = require('../../../src/data/sql'),
    execute = require('../../../src/data/sql/execute'),
    queries = require('../../../src/query'),
    config = require('./infrastructure/config'),
    expect = require('chai')
        .use(require('chai-subset'))
        .expect,
    operations;

describe('azure-mobile-apps.data.sql.integration', function () {
    before(function (done) {
        operations = index(config)({ name: 'integration', 
            columns: { string: 'string', number: 'number', bool: 'boolean' }
        });

        operations.initialize().then(done);
    });

    beforeEach(function (done) {
        return operations.truncate().then(done);
    });

    after(function (done) {
        index(config).execute({ sql: 'DROP TABLE integration' }).then(done);
    });

    it("basic connection test", function () {
        return execute(config, { sql: 'select * from integration', parameters: [] });
    });

    it("basic integration test", function () {
        return insert({ id: '1', string: 'test', bool: false, number: 1.1 })
            .then(function (results) {
                expect(results).to.containSubset({ id: '1', string: 'test', bool: false, number: 1.1 });
                return read();
            })
            .then(function (results) {
                expect(results).to.containSubset([{ id: '1', string: 'test', bool: false, number: 1.1 }]);
                return update({ id: '1', string: 'test2', bool: true, number: 2.2  });
            })
            .then(read)
            .then(function (results) {
                expect(results).to.containSubset([{ id: '1', string: 'test2', bool: true, number: 2.2 }]);
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
                expect(results).to.containSubset([{ id: '1', string: 'test2', bool: true, number: 1.1 }]);
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

    it("handles large numeric values", function () {
        return insert({ id: '1', string: 'test', number: null })
            .then(read)
            .then(function (results) {
                expect(results[0].number).to.equal(null);
                expect(results[0].string).to.equal('test');
                return update({ id: '1', string: null, number: 1 })
            })
            .then(read)
            .then(function (results) {
                expect(results[0].number).to.equal(1);
                expect(results[0].string).to.equal(null);
            });
    });

    it("handles null values", function () {
        return insert({ id: '1', number: Number.MAX_VALUE })
            .then(read)
            .then(function (results) {
                expect(results[0].number).to.equal(Number.MAX_VALUE);
            });
    });

    it("handles zero values", function () {
        return insert({ id: '1', number: 0 })
            .then(read)
            .then(function (results) {
                expect(results[0].number).to.equal(0);
            });
    });

    it("handles read operations with no query", function () {
        return insert({ id: '1' })
            .then(function () {
                return operations.read();
            })
            .then(function (results) {
                expect(results.length).to.equal(1);
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
