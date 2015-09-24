// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../..'),
    app, mobileApp;

describe('azure-mobile-apps.express.integration', function () {
    describe('errors', function () {
        it('returns error details when in debug mode', function () {
            setup(true);
            return supertest(app)
                .get('/tables/todoitem')
                .expect(500)
                .then(function (res) {
                    expect(res.body.message).to.equal('test');
                    expect(res.body.stack).to.not.be.undefined;
                });
        });

        it('does not return error details when not in debug mode', function () {
            setup(false);
            return supertest(app)
                .get('/tables/todoitem')
                .expect(500)
                .then(function (res) {
                    expect(res.body).to.be.empty;
                });
        });

        function setup(debug) {
            app = express();
            mobileApp = mobileApps({ debug: debug });
            var table = mobileApp.table();
            table.read.use(function (req, res, next) { throw new Error('test'); });
            mobileApp.tables.add('todoitem', table);
            mobileApp.attach(app);
        }
    });

    describe('version', function () {
        it('attaches server version header', function () {
            app = express();
            mobileApp = mobileApps();
            mobileApp.tables.add('todoitem');
            mobileApp.attach(app);

            return supertest(app)
                .get('/tables/todoitem')
                .expect('x-zumo-server-version', 'node-' + require('../../../package.json').version);
        });

        it('does not attach version header if version is set to undefined', function() {
            app = express();
            mobileApp = mobileApps({ version: undefined });
            mobileApp.tables.add('todoitem');
            mobileApp.attach(app);

            return supertest(app)
                .get('/tables/todoitem')
                .expect(function (res) {
                    expect(res.headers['x-zumo-version']).to.be.undefined;
                });
        });

        it('does not attach version header if MS_DisableVersionHeader is specified', function() {
            process.env.MS_DisableVersionHeader = 'true';

            app = express();
            mobileApp = mobileApps();
            mobileApp.tables.add('todoitem');
            mobileApp.attach(app);

            return supertest(app)
                .get('/tables/todoitem')
                .expect(function (res) {
                    expect(res.headers['x-zumo-version']).to.be.undefined;
                    delete process.env.MS_DisableVersionHeader;
                });
        });
    });
});
