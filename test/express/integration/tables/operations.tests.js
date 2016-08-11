// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    data = require('../../../../src/data'),
    express = require('express'),
    mobileApps = require('../../../appFactory'),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.tables.operations', function () {
    beforeEach(function (done) {
        app = express();
        mobileApp = createMobileApp().then(function () {
            done();
        }, done);
    });

    afterEach(mobileApps.cleanUp(mobileApps.configuration()).testTable({ name: 'operations' }));

    it('allows filters on reads', function () {
        return supertest(app)
            .get('/tables/operations')
            .expect(function (res) {
                expect(res.body.length).to.equal(2);
                expect(res.body).to.containSubset([
                    { id: '1', userId: '1' },
                    { id: '2', userId: '1' }
                ]);
            });
    });

    it('allows filters on deletes and returns a 404 when filtered', function () {
        return supertest(app)
            .delete('/tables/operations/3')
            .expect(404);
    });

    it('allows filters on deletes and behaves as normal when not filtered', function () {
        return supertest(app)
            .delete('/tables/operations/1')
            .expect(200);
    });

    it('allows filters on updates and returns a 404 when filtered', function () {
        return supertest(app)
            .patch('/tables/operations/3')
            .send({ userId: '1' })
            .expect(404);
    });

    it('allows filters on updates and behaves as normal when not filtered', function () {
        return supertest(app)
            .patch('/tables/operations/1')
            .send({ userId: '1' })
            .expect(200);
    });

    it('applies filters to results of update operations', function () {
        return supertest(app)
            .delete('/tables/operations/1')
            .expect(200)
            .then(function () {
                return supertest(app)
                    .patch('/tables/operations/1')
                    .send({ userId: '2' })
                    // this 404s because the updated record isn't selected back out after the userId is changed
                    .expect(404)
            })
            .then(function () {
                // this succeeds in the test below, so we know the above update actually succeeded
                return supertest(app)
                    .post('/tables/operations/1')
                    .expect(404)
            });
    });

    it('allows filters on deletes and behaves as normal when not filtered', function () {
        return supertest(app)
            .delete('/tables/operations/1')
            .expect(200)
            .then(function () {
                return supertest(app)
                    .post('/tables/operations/1')
                    .expect(201)
            });
    });

    function createFilter(operation) {
        return function (context) {
            expect(context.operation).to.equal(operation);
            context.query.where({ userId: '1' });
            return context.execute();
        }
    }

    function createMobileApp(operation) {
        mobileApp = mobileApps();

        var table = mobileApp.table();
        table.read(createFilter('read'));
        table.update(createFilter('update'));
        table.delete(createFilter('delete'));
        table.undelete(createFilter('undelete'));
        table.seed = [
            { id: '1', userId: '1' },
            { id: '2', userId: '1' },
            { id: '3', userId: '2' }
        ];
        table.softDelete = true;

        mobileApp.tables.add('operations', table);
        app.use(mobileApp);
        return mobileApp.tables.initialize();
    }
});
