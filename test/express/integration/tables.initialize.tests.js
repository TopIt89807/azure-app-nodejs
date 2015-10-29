// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../src/express'),
    config = require('../infrastructure/config').data(),
    data = require('../../../src/data/sql'),

    app, mobileApp;

// the default configuration uses the in-memory data provider - it does not (yet) support queries
describe('azure-mobile-apps.express.integration.tables.initialize', function () {
    beforeEach(function () {
        setup({ string: 'string', number: 'number' });
    });

    afterEach(function (done) {
        data(config).execute({ sql: 'drop table initialize' }).then(done, done);
    });

    it('creates non-dynamic tables', function () {
        return supertest(app)
            .post('/tables/initialize')
            .send({ id: '1' })
            .expect(500)
            .then(function () {
                return mobileApp.tables.initialize();
            })
            .then(function () {
                return supertest(app)
                    .post('/tables/initialize')
                    .send({ id: '1' })
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body.string).to.be.null;
                        expect(res.body.number).to.be.null;
                    });
            })
    });

    it('updates non-dynamic tables', function () {
        return mobileApp.tables.initialize()
            .then(function () {
                return supertest(app)
                    .post('/tables/initialize')
                    .send({ id: '1' })
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body.boolean).to.be.undefined;
                    });
            })
            .then(function () {
                setup({ string: 'string', number: 'number', boolean: 'boolean' });
                return mobileApp.tables.initialize();
            })
            .then(function () {
                return supertest(app)
                    .get('/tables/initialize')
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body[0].boolean).to.be.null;
                    });
            });

    });

    function setup(columns) {
        app = express();
        mobileApp = mobileApps({ skipVersionCheck: true, data: config });
        mobileApp.tables.add('initialize', { dynamicSchema: false, columns: columns });
        app.use(mobileApp);
    }
});
