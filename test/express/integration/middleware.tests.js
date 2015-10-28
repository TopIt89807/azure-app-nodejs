// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    app = require('express')(),
    mobileApp,
    oldConnectionString = process.env.MS_TableConnectionString;

describe('azure-mobile-apps.express.integration.middleware', function () {
    before(function () {
        // environment settings override configured settings - hack to force use of the memory provider
        delete process.env.MS_TableConnectionString;
        mobileApp = require('../../..')({ skipVersionCheck: true })
    });

    after(function () {
        if(oldConnectionString)
            process.env.MS_TableConnectionString = oldConnectionString;
    })

    it('read middleware is mounted in the correct order', function () {
        return test('read', 'get');
    });

    it('insert middleware is mounted in the correct order', function () {
        return test('insert', 'post');
    });

    it('update middleware is mounted in the correct order', function () {
        return test('update', 'patch');
    });

    it('delete middleware is mounted in the correct order', function () {
        return test('delete', 'delete');
    });

    it('undelete middleware is mounted in the correct order', function () {
        return test('undelete', 'post', '/1');
    });

    function test(operation, verb, urlSuffix) {
        var results = [];

        mobileApp.use(appendResult(1));

        var table = mobileApp.table();
        table.use(appendResult(2), table.execute, appendResult(5));
        table[operation].use(appendResult(3), table.operation, appendResult(4));
        mobileApp.tables.add('test', table);
        app.use(mobileApp);

        return supertest(app)
            [verb]('/tables/test' + (urlSuffix || ''))
            .expect(200)
            .then(function (res) {
                expect(results).to.deep.equal([1, 2, 3, 4, 5]);
            });

        function appendResult(result) {
            return function (req, res, next) {
                results.push(result);
                next();
            }
        }
    }
});
