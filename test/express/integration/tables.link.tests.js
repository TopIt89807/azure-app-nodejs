// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../src'),
    connectionString,

    app, mobileApp;

// the default configuration uses the in-memory data provider - it does not (yet) support queries
describe('azure-mobile-apps.express.integration.tables.link', function () {
    before(function () {
        connectionString = process.env.MS_TableConnectionString;
        delete process.env.MS_TableConnectionString;
    });

    after(function () {
        if (connectionString)
            process.env.MS_TableConnectionString = connectionString;
    });

    beforeEach(function () {
        app = express();
        mobileApp = mobileApps({ pageSize: 2, skipVersionCheck: true });
    });

    it('adds Link header when top > pageSize & results.length === pageSize', function () {
        mobileApp = mobileApps({ pageSize: 1, skipVersionCheck: true });
        mobileApp.tables.add('headers');
        app.use(mobileApp);
        return supertest(app)
            .post('/tables/headers')
            .send({ id: '1' })
            .expect(200)
            .then(function () {
                return supertest(app)
                    .get('/tables/headers?$top=2')
                    .expect(200)
                    .expect(function (res) {
                        expect(res.headers.link).to.contain('?%24top=1&%24skip=1; rel=next');
                    });
            });
    });

    it('adds Link header when top > take & results.length === take', function () {
        var table = mobileApps.table();

        table.read(function (context) {
            context.query = context.query.take(1);
            return context.execute();
        });

        mobileApp.tables.add('headers', table);
        app.use(mobileApp);
        return supertest(app)
            .post('/tables/headers')
            .send({ id: '1' })
            .expect(200)
            .then(function () {
                return supertest(app)
                    .get('/tables/headers?$top=2')
                    .expect(200)
                    .expect(function (res) {
                        expect(res.headers.link).to.contain('?%24top=1&%24skip=1; rel=next');
                    });
            });
    });

    it('adds no Link header when top <== pageSize', function () {
        mobileApp.tables.add('headers');
        app.use(mobileApp);
        return supertest(app)
            .post('/tables/headers')
            .send({ id: '1' })
            .expect(200)
            .then(function () {
                return supertest(app)
                    .get('/tables/headers?$top=1')
                    .expect(200)
                    .expect(function (res) {
                        // no link, because $top < pageSize
                        expect(res.headers.link).to.be.undefined;
                    });
            });
    });

    it('adds no Link header when top === result.count', function () {
        mobileApp.tables.add('headers');
        app.use(mobileApp);
        return supertest(app)
            .post('/tables/headers')
            .send({ id: '1' })
            .expect(200)
            .then(function () {
                return supertest(app)
                    .get('/tables/headers?$top=2')
                    .expect(200)
                    .expect(function (res) {
                        // no link, because $top < pageSize
                        expect(res.headers.link).to.be.undefined;
                    });
            });
    });
});
