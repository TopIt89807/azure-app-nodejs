// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    data = require('../../../src/data/mssql'),
    express = require('express'),
    mobileApps = require('../infrastructure/mobileApps'),
    config = require('../infrastructure/config'),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.tables.filters', function () {
    beforeEach(function (done) {
        app = express();
        mobileApp = createMobileApp().then(function () {
            done();
        }, done);
    });

    afterEach(function (done) {
        data(config.data()).execute({ sql: 'drop table filters' }).then(done, done);
    });

    it('allows filters on reads', function () {
        return supertest(app)
            .get('/tables/filters')
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
            .delete('/tables/filters/3')
            .expect(404);
    });

    it('allows filters on deletes and behaves as normal when not filtered', function () {
        return supertest(app)
            .delete('/tables/filters/1')
            .expect(200);
    });

    function filter(context) {
        context.query.where({ userId: '1' });
        return context.execute();
    }

    function createMobileApp(operation) {
        mobileApp = mobileApps();

        var table = mobileApp.table();
        table.read(filter);
        table.update(filter);
        table.delete(filter);
        table.seed = [
            { id: '1', userId: '1' },
            { id: '2', userId: '1' },
            { id: '3', userId: '2' }
        ];

        mobileApp.tables.add('filters', table);
        app.use(mobileApp);
        return mobileApp.tables.initialize();
    }
});
