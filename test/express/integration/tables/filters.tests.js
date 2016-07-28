// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../appFactory'),
    data = require('../../../../src/data'),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.tables.filters', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps();
        mobileApp.tables.add('filters', {
            filters: [function (query, context) {
                query.where({ testHeaderValue: context.req.get('test-header') });
            }],
            transforms: [function (item, context) {
                item.testHeaderValue = context.req.get('test-header');
            }]
        });
        app.use(mobileApp);
    });

    afterEach(mobileApps.cleanUp(mobileApps.configuration()).testTable({ name: 'filters' }));

    it('applies table filters and transforms', function () {
        return supertest(app)
            .post('/tables/filters')
            .set('test-header', 'test')
            .send({ id: '1' })
            .expect(201)
            .then(function (res) {
                return supertest(app)
                    .get('/tables/filters/1')
                    .set('test-header', 'test')
                    .expect(200);
            })
            .then(function (res) {
                expect(res.body.testHeaderValue).to.equal('test');
            })
            .then(function (res) {
                return supertest(app)
                    .get('/tables/filters/1')
                    .set('test-header', 'test2')
                    .expect(404);
            })
    });
});