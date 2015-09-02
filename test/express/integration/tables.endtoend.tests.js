// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    request = require('supertest-as-promised'),
    config = require('../infrastructure/config')(),
    app = require('express')(),
    mobileApp = require('../../../src/express')(config),
    data = require('../../../src/data/sql'),
    config = require('../infrastructure/config').data();

describe('azure-mobile-apps.express.integration.endtoend', function () {
    beforeEach(dropTable);
    afterEach(dropTable);

    function dropTable(done) {
        data(config).execute({ sql: 'drop table endtoend' }).then(done, function () { done() });
    }

    it('import, initialise, persist and query with custom middleware and operations', function () {
        mobileApp.tables.import('../files/tables/endtoend');
        mobileApp.attach(app);

        return insert({ id: '1', clientValue: 'show' })
            .then(function (res) {
                // insert middleware and operation have executed
                expect(res.body).to.containSubset({ id: '1', clientValue: 'show', insertOperation: 'insert', insertMiddleware: 'insert' });
                return insert({ id: '2', clientValue: 'noshow' });
            })
            .then(function (res) {
                return request(app).get('/tables/endtoend').expect(200);
            })
            .then(function (res) {
                // read query has been augmented with { clientValue: 'show' } so it will only return the first record
                expect(res.body).to.containSubset([{ id: '1', clientValue: 'show', insertOperation: 'insert', insertMiddleware: 'insert', readOperation: 'read', readMiddleware: 'read' }]);
                return update({ id: '2', clientValue: 'show' });
            })
            .then(function (res) {
                // update middleware and operation have executed
                expect(res.body).to.containSubset({ id: '2', clientValue: 'show', insertOperation: 'insert', insertMiddleware: 'insert', updateOperation: 'update', updateMiddleware: 'update' });
                return request(app).get("/tables/endtoend?$filter=id gt '1'").expect(200);
            })
            .then(function (res) {
                // OData query is executed and returns updated record
                expect(res.body).to.containSubset([{ id: '2', clientValue: 'show', insertOperation: 'insert', insertMiddleware: 'insert', updateOperation: 'update', updateMiddleware: 'update', readOperation: 'read', readMiddleware: 'read' }]);
            })
            .catch(convertError);
    });
});

function insert(item) {
    return request(app).post('/tables/endtoend').send(item).expect(200);
}

function update(item) {
    return request(app).patch('/tables/endtoend').send(item).expect(200);
}

function convertError(err) {
    if(err && err.response) {
        var body = err.response.body,
            result = body.constructor === String ? body : JSON.stringify(body);
        throw new Error(err.message + ' - ' + result);
    }
    throw err;
}
