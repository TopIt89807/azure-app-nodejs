// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../appFactory'),
    auth = require('../../../src/auth')({ secret: 'secret' }),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.authStub', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps({ auth: { secret: 'secret' }, homePage: true, authStubClaims: { sub: 'test' } });
        app.use(mobileApp);
    });

    it('.auth/login/provider returns appropriate postMessage', function () {
        return supertest(app)
            .get('/.auth/login/facebook')
            .expect(200)
            .then(function (res) {
                var envelope = JSON.parse(res.text.match(/postMessage\('(.*)', '\*'\)/)[1]),
                    token = envelope.oauth.authenticationToken;
                expect(token).to.not.be.undefined;
                return auth.validate(token);
            });
    });

    it('.auth/login/provider returns appropriate redirect', function () {
        return supertest(app)
            .get('/.auth/login/facebook')
            .expect(200)
            .then(function (res) {
                var envelope = JSON.parse(decodeURIComponent(res.text.match(/token=(.*)';/)[1])),
                    token = envelope.authenticationToken;
                expect(token).to.not.be.undefined;
                return auth.validate(token);
            });
    });

    it('authStub tokens can be used against app', function () {
        return supertest(app)
            .get('/.auth/login/facebook')
            .expect(200)
            .then(function (res) {
                var envelope = JSON.parse(res.text.match(/postMessage\('(.*)', '\*'\)/)[1]),
                    token = envelope.oauth.authenticationToken;
                expect(token).to.not.be.undefined;

                return supertest(app)
                    .get('/')
                    .set('x-zumo-auth', token)
                    .expect(200);
            });
    });

    it('authStub uses payload set in authStubClaims configuration object', function () {
        return supertest(app)
            .get('/.auth/login/facebook')
            .expect(function (res) {
                var envelope = JSON.parse(res.text.match(/postMessage\('(.*)', '\*'\)/)[1]),
                    token = envelope.oauth.authenticationToken;
                expect(auth.decode(token).id).to.equal('test');
            });
    });
});
