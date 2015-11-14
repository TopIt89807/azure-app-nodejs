// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    bodyParser = require('body-parser'),
    mobileApps = require('../../../src'),
    connectionString,

    app, mobileApp;

// the default configuration uses the in-memory data provider - it does not (yet) support queries
describe('azure-mobile-apps.express.integration.tables.behavior', function () {
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
        mobileApp = mobileApps({ skipVersionCheck: true, logging: false });
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
        mobileApp = mobileApps({ debug: true, skipVersionCheck: true, logging: false });
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
        mobileApp = mobileApps({ maxTop: 1000, logging: false });
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem?$top=1001')
            .expect(400);
    });

    it('returns 200 when request size limit is set to 0', function () {
        mobileApp = mobileApps({ maxTop: 0, skipVersionCheck: true });
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem?$top=1000000')
            .expect(200);
    });

    it('sets request size limit implicitly (query.take) to pageSize', function () {
        var table = mobileApps.table(),
            query;

        table.read(function (context) {
            query = context.query.toOData();
        });

        mobileApp = mobileApps({ pageSize: 40, skipVersionCheck: true });
        mobileApp.tables.add('todoitem', table);
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(function (err, res) {
                expect(query).to.contain('$top=40');
            });
    });

    it('returns 405 for disabled operations', function () {
        mobileApp.tables.add('todoitem', { read: { disable: true }});
        app.use(mobileApp);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(405);
    });

    it('accepts ID on querystring for patch request', function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/todoitem')
            .send({ id: 1, text: 'test' })
            .expect(200)
            .then(function () {
                return supertest(app)
                    .patch('/tables/todoitem/1')
                    .send({ text: 'test2' })
                    .expect(200);
            })
            .then(function () {
                return supertest(app)
                    .get('/tables/todoitem')
                    .expect(function (res) {
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0].text).to.equal('test2');
                    })
            });
    });

    it('returns 400 if item ID and querystring ID do not match', function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/todoitem')
            .send({ id: 1, text: 'test' })
            .expect(200)
            .then(function () {
                return supertest(app)
                    .patch('/tables/todoitem/2')
                    .send({ id: 1, text: 'test2' })
                    .expect(400);
            })
    });

    it('returns 400 if invalid json', function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/todoitem')
            .send('{ "id": 1,, "text": "test" }')
            .set('Content-Type', 'application/json')
            .expect(400);
    });

    it('treats content as json if falsey content-type', function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/todoitem')
            .send('{ "id": 1, "text": "test" }')
            .set('Content-Type', '')
            .expect(200)
            .then(function (res) {
                expect(res.body.id).to.equal(1);
            });
    });

    it('passes through non-json content-type', function () {
        var table = mobileApp.table();

        table.use(function (req, res, next) {
            var options = { type: function () { return true; }};
            bodyParser.text(options)(req, res, function (error) {
                req.azureMobile.item = req.body;
                next(error);
            });
        }, table.operation);

        table.insert(function (context) {
            return { id: 1, text: context.item }
        });

        mobileApp.tables.add('todoitem', table);
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/todoitem')
            .send('text')
            .set('Content-Type', 'text')
            .expect(200)
            .then(function (res) {
                expect(res.body.text).to.equal('text');
            });
    });
});
