// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('../../appFactory').configuration().data,
    execute = require('../../../src/data/mssql/execute'),
    index = require('../../../src/data/mssql'),
    queries = require('../../../src/query'),
    expect = require('chai').expect,
    operations;

describe('azure-mobile-apps.data.sql.integration.concurrency', function () {
    before(function () {
        operations = index(config)({ name: 'concurrency' });
    });

    afterEach(function (done) {
        execute(config, { sql: 'drop table dbo.concurrency' }).then(done, done);
    });

    it('assigns value to version column', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                expect(inserted.version).to.not.be.undefined;
            });
    });

    it('does not update items with incorrect version', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return update({ id: '1', value: 'test2', version: 'no match' });
            })
            .then(function () {
                throw new Error('Record with mismatching version was updated');
            }, function () { });
    });

    it('updates items with correct version', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return update({ id: '1', value: 'test2', version: inserted.version });
            })
            .then(function () { }, function () {
                throw new Error('Record with matching version was not updated');
            });
    });

    it('does not delete items with incorrect version', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return del('1', 'no match');
            })
            .then(function () {
                throw new Error('Record with mismatching version was deleted');
            }, function () { });
    });

    it('deletes items with correct version', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return del('1', inserted.version);
            })
            .then(function () { }, function () {
                throw new Error('Record with matching version was not deleted');
            });
    });

    it('throws duplicate error when inserting rows with duplicate IDs', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return insert({ id: '1', value: 'test' })
            })
            .then(function () {
                throw new Error('Succeeded inserting duplicate ID');
            }, function () {});
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

    function del(id, version) {
        var query = queries.create('integration').where({ id: id });
        if(version)
            query.where({ version: version });
        return operations.delete(query);
    }
});
