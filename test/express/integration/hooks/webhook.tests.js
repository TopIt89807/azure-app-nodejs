// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../appFactory'),
    bodyParser = require('body-parser'),
    auth = require('../../../../src/auth'),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.hooks.webhook', function () {
    // just test read and create, others require an item to be created first, adds too much complexity
    it("posts appropriate body for read operations", function (done) {
        test('get', function (req) {
            expect(req.body).to.deep.equal({
                operation: 'read',
                table: 'webhook'
            });
            done(); 
        });
    });

    it("posts appropriate body for create operations", function (done) {
        test('post', function (req) {
            expect(req.body).to.containSubset({
                operation: 'create',
                table: 'webhook'
            });
            expect(req.body).to.have.property('item');
            expect(req.body.item).to.have.property('id');
            expect(req.body.item).to.have.property('version');
            done(); 
        });
    });

    it("posts userId when requests are authenticated", function (done) {
        test('get', function (req) {
            expect(req.body.userId).to.equal('userId');
            done(); 
        }, 'userId');
    })

    function test(verb, webhook, username) {
        var table = { webhook: { } };
        app = express();
        mobileApp = mobileApps();
        mobileApp.tables.add('webhook', table);
        app.use(mobileApp);

        // add a route that executes the passed webhook handler
        app.post('/webhook', bodyParser.json(), webhook);

        var test = supertest(app)[verb]('/tables/webhook');

        // extract the url from supertest (it has a random port) and assign it to our webhook - just drop the /tables
        table.webhook.url = test.url.replace('/tables', '');

        // send an empty object to create. ignored for get requests
        test.send({});

        if(username) test.set('x-zumo-auth', auth(mobileApp.configuration.auth).sign({ sub: username }));

        // send the request - signalling the test is complete is done from inside the passed webhook handler
        test.end();
    }
});