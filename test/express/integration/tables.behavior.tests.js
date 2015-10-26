// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../src/express'),

    app, mobileApp;

// the default configuration uses the in-memory data provider - it does not (yet) support queries
describe('azure-mobile-apps.express.integration.tables.behavior', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps();
    });

    it('returns 200 for table route', function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(200);
    });

    it('returns 200 for table route with id parameter', function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        supertest(app)
            .get('/tables/todoitem/id')
            .expect(200);
    });

    it('returns 404 for tables that are not registered', function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem2')
            .expect(404);
    });

    it('returns 500 with error details when exception is thrown', function (done) {
        var table = mobileApp.table();
        table.read.use(function (req, res, next) { throw 'test'; });
        mobileApp = mobileApps({ debug: true });
        mobileApp.tables.add('todoitem', table);
        app.use(mobileApp);

        supertest(app)
            .get('/tables/todoitem')
            .expect(500)
            .end(function (err, res) {
                expect(res.body).to.deep.equal({"error":"test"});
                done();
            });
    });
    
    it('returns 400 when request size limit is exceeded', function () {
        mobileApp = mobileApps({ maxTop: 1000 });
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem?$top=1001')
            .expect(400);
    });

    it('returns 200 when request size limit is set to 0', function () {
        mobileApp = mobileApps({ maxTop: 0 });
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem?$top=1000000')
            .expect(200);
    });

    it('sets request size limit implicitly', function () {
        var table = mobileApps.table(),
            query;

        table.read(function (context) {
            query = context.query.toOData();
        });

        mobileApp = mobileApps({ maxTop: 1000 });
        mobileApp.tables.add('todoitem', table);
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(function (err, res) {
                expect(query).to.contain('$top=1000');
            });
    });
});
