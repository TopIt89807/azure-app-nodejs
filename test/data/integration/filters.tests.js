// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../../src/query'),
    config = require('../../appFactory').configuration().data,
    expect = require('chai').use(require('chai-subset')).use(require('chai-as-promised')).expect;

describe('azure-mobile-apps.data.integration.filters', function () {
    var index = require('../../../src/data'),
        data = index(config),
        cleanUp = require('../' + config.provider + '/integration.cleanUp'),
        table = {
            name: 'filters',
            seed: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
            filters: [function (query) {
                return query.where(function () { return this.id >= '3'; });
            }]
        },
        operations;

    before(function (done) {
        operations = data(table);
        operations.initialize().then(function (inserted) { }).then(done, done);
    });

    afterEach(function (done) {
        cleanUp(config, table).then(function (arg) { done() }, done);
    });

    it('attaches filter to read queries', function () {
        return read().then(function (results) {
            expect(results.length).to.equal(2);
            expect(results[0].id).to.equal('3');
            expect(results[1].id).to.equal('4');
        });
    });

    // it('attaches filter to update queries', function () {

    // });

    // it('attaches filter to delete queries', function () {

    // });

    // it('attaches filter to undelete queries', function () {

    // });

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
        return operations.delete(queries.create('integration').where({ id: id }));
    }
});