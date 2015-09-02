// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../src/express'),
    data = require('../../../src/data/sql'),
    config = require('../infrastructure/config').data(),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.tables.data', function () {
    beforeEach(function (done) {
        app = express();
        mobileApp = mobileApps({ data: config });
        data(config)({ name: 'integration' }).truncate().then(done);
    });

    it('returns inserted records', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test", bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                return supertest(app)
                    .get('/tables/integration')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body).to.deep.equal([{ id: '1', string: "test", bool: true, number: 1 }]);
            });
    });

    it('returns updated records', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test" })
            .then(function (res) {
                return supertest(app)
                    .patch('/tables/integration')
                    .send({ id: 1, string: "test2", bool: true, number: 1 })
            })
            .then(function (res) {
                return supertest(app).get('/tables/integration');
            })
            .then(function (res) {
                expect(res.body).to.deep.equal([{ id: '1', string: "test2", bool: true, number: 1 }]);
            });
    });

    it('does not return deleted records', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test" })
            .expect(200)
            .then(function (res) {
                return supertest(app)
                    .delete('/tables/integration/1')
                    .expect(200);
            })
            .then(function (res) {
                return supertest(app).get('/tables/integration');
            })
            .then(function (res) {
                expect(res.body).to.deep.equal([]);
            });
    });

    it('returns inserted item', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test", bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                expect(res.body).to.deep.equal({ id: '1', string: "test", bool: true, number: 1 });
            });
    });

    it('returns empty array when table with dynamic schema has not been created', function () {
        mobileApp.tables.add('nonexistent');
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/nonexistent')
            .expect(200)
            .then(function (res) {
                expect(res.body).to.deep.equal([]);
            });
    });

    it('returns empty array when table with dynamic schema has not been updated', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test" })
            .then(function (res) {
                return supertest(app)
                    .get('/tables/integration?$filter=newCol eq 1')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body).to.deep.equal([]);
            });
    });

    it('assigns guid id if none is provided and table does not have an autoIncrement id', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ string: "test", bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                return supertest(app)
                    .get('/tables/integration')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body.length).to.equal(1);
                expect(res.body[0].id).to.not.be.undefined;
            });
    });

    it('returns single object for id query', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test", bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                return supertest(app)
                    .get('/tables/integration/1')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body).to.deep.equal({ id: '1', string: "test", bool: true, number: 1 });
            });
    });

    it('returns empty array when collection query returns no results', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/integration?$filter=id eq 100')
            .expect(200)
            .then(function (res) {
                expect(res.body).to.deep.equal([]);
            });
    });

    it('returns 404 when id query returns no results', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/integration/nonexistent')
            .expect(404);
    });

    it('returns 404 when delete operation executed for non-existent record', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .delete('/tables/integration/nonexistent')
            .expect(404);
    });

    it('returns 200 when delete operation executed successfully', function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test", bool: true, number: 1 })
            .expect(200)
            .then(function (res) {
                return supertest(app)
                    .delete('/tables/integration/1')
                    .expect(200);
            });
    });

    it("returns total count when requested", function () {
        mobileApp.tables.add('integration');
        mobileApp.attach(app);

        return supertest(app)
            .post('/tables/integration')
            .send({ id: '1', string: "test", bool: true, number: 1 })
            .expect(200)
            .then(function () {
                return supertest(app)
                    .post('/tables/integration')
                    .send({ id: '2', string: "test2", bool: false, number: 2 })
                    .expect(200)
            })
            .then(function () {
                return supertest(app)
                    .get('/tables/integration?$top=1&$inlinecount=allpages')
                    .expect(200);
            })
            .then(function (results) {
                expect(results.body).to.deep.equal({
                    results: [{ id: '1', string: "test", bool: true, number: 1 }],
                    count: 2
                })
            });
    });
});
