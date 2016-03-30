// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var targets = require('./targets'),
    config = require('../../appFactory').configuration().data,
    queries = require('../../../src/query'),
    expect = require('chai').expect;

targets.forEach(function (target) {
    describe('azure-mobile-apps.data.' + target + '.integration.softDelete', function () {
        var index = require('../../../src/data/' + target),
            cleanUp = require('../' + target + '/integration.cleanUp'),
            table = { name: 'softDelete', softDelete: true },
            operations;

        before(function () {
            operations = index(config)(table);
        });

        afterEach(function (done) {
            cleanUp(config, table).then(done, done);
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
});
