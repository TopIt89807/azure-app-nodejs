// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../src/express'),
    data = require('../../../src/data/sql'),
    config = require('../infrastructure/config').data(),
    promises = require('../../../src/utilities/promises'),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.tables.dynamicSchema', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps({ data: config });
    });

    afterEach(function (done) {
        data(config).execute({ sql: 'drop table dynamic' }).then(done, done);
    });

    it('creates table and returns inserted records', function () {
        mobileApp.tables.add('dynamic');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/dynamic')
            .send({ id: '1', string: 'test', bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                return supertest(app)
                    .get('/tables/dynamic')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body).to.containSubset([{ id: '1', string: 'test', bool: true, number: 1 }]);
            });
    });

    it('updates table schema', function () {
        mobileApp.tables.add('dynamic');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/dynamic')
            .send({ id: '1', string: 'one' })
            .then(function () {
                return supertest(app)
                    .post('/tables/dynamic')
                    .send({ id: '2', string: 'two', bool: false, number: 2 });
            })
            .then(function () {
                return supertest(app).get('/tables/dynamic');
            })
            .then(function (res) {
                expect(res.body).to.containSubset([
                    { id: '1', string: 'one', bool: null, number: null },
                    { id: '2', string: 'two', bool: false, number: 2 }
                ]);
            });
    });

    it('creates table with numeric id and returns inserted records', function () {
        mobileApp.tables.add('dynamic');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/dynamic')
            .send({ id: 1, string: 'test', bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                return supertest(app)
                    .get('/tables/dynamic')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body).to.containSubset([{ id: 1, string: 'test', bool: true, number: 1 }]);
            });
    });

    it('creates table with autoIncrement id', function () {
        mobileApp.tables.add('dynamic', { autoIncrement: true });
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/dynamic')
            .send({ string: 'test', bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                expect(res.body).to.containSubset({ id: 1, string: 'test', bool: true, number: 1 });
            });
    });

    it('updates __updatedAt column', function () {
        var updatedAt;

        mobileApp.tables.add('dynamic');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/dynamic')
            .send({ id: '1', string: 'one' })
            .then(function (inserted) {
                updatedAt = inserted.body.__updatedAt;
                return promises.sleep(20);
            })
            .then(function () {
                return supertest(app)
                    .patch('/tables/dynamic')
                    .send({ id: '1', string: 'two' });
            })
            .then(function (updated) {
                expect(updated.body.__updatedAt).to.be.greaterThan(updatedAt);
            });
    });

    it('creates predefined columns', function () {
        mobileApp.tables.add('dynamic', { columns: {
            string: 'string',
            number: 'number',
            bool: 'boolean',
            date: 'datetime'
        } });
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/dynamic')
            .send({ id: '1' })
            .then(function (inserted) {
                expect(inserted.body).to.containSubset({ id: '1', string: null, number: null, bool: null, date: null });
            });
    });
});
