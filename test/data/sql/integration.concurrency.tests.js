// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('./infrastructure/config'),
    execute = require('../../../src/data/sql/execute'),
    index = require('../../../src/data/sql'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sql.integration.concurrency', function () {
    var operations = index(config)({ name: 'concurrency' });

    afterEach(function (done) {
        execute(config, { sql: 'drop table dbo.concurrency' }).then(done, done);
    });

    it('assigns value to version column', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                expect(inserted.__version).to.not.be.undefined;
            });
    });

    it('does not update items with incorrect version', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return update({ id: '1', value: 'test2', __version: 'no match' });
            })
            .then(function () {
                throw new Error('Record with mismatching version was updated');
            }, function () { });
    });

    it('updates items with correct version', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return update({ id: '1', value: 'test2', __version: inserted.__version });
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

    it('updates items with correct version', function () {
        return insert({ id: '1', value: 'test' })
            .then(function (inserted) {
                return del('1', inserted.__version);
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
        return operations.delete(id, version);
    }
});
