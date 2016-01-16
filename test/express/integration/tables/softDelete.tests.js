// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../infrastructure/appFactory'),
    data = require('../../../../src/data/mssql'),
    config = require('../../../infrastructure/configuration'),

    app, mobileApp;

describe('azure-mobile-apps.express.sql.integration.tables.softDelete', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps();
    });

    afterEach(function (done) {
        data(config().data).execute({ sql: 'drop table softDelete' }).then(done, done);
    });

    it('deleted records are not returned', function () {
        mobileApp.tables.add('softDelete', { softDelete: true });
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/softDelete')
            .send({ id: '1', value: 'test' })
            .expect(201)
            .then(function () {
                return supertest(app)
                    .delete('/tables/softDelete/1')
                    .expect(200);
            })
            .then(function () {
                return supertest(app)
                    .get('/tables/softDelete')
                    .expect(200);
            })
            .then(function (results) {
                expect(results.body.length).to.equal(0);
            })
    });

    it('deleted records are returned when requested', function () {
        mobileApp.tables.add('softDelete', { softDelete: true });
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/softDelete')
            .send({ id: '1', value: 'test' })
            .expect(201)
            .then(function () {
                return supertest(app)
                    .delete('/tables/softDelete/1')
                    .expect(200);
            })
            .then(function () {
                return supertest(app)
                    .get('/tables/softDelete?__includeDeleted=true')
                    .expect(200);
            })
            .then(function (results) {
                expect(results.body.length).to.equal(1);
            })
    });

    it('deleted records can be undeleted', function () {
        mobileApp.tables.add('softDelete', { softDelete: true });
        app.use(mobileApp);

        return supertest(app)
            .post('/tables/softDelete')
            .send({ id: '1', value: 'test' })
            .expect(201)
            .then(function () {
                return supertest(app)
                    .delete('/tables/softDelete/1')
                    .expect(200);
            })
            .then(function () {
                return supertest(app)
                    .post('/tables/softDelete/1')
                    .expect(201);
            })
            .then(function () {
                return supertest(app)
                    .get('/tables/softDelete')
                    .expect(200);
            })
            .then(function (results) {
                expect(results.body.length).to.equal(1);
            })
    })
});
