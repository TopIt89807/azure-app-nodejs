// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    request = require('supertest-as-promised'),
    config = require('../infrastructure/config')(),
    auth = require('../../../src/auth')({ secret: 'secret' }),
    token = auth.sign({ "uid": "Facebook:someuserid@hotmail.com" }),
    app, mobileApp;

    app = require('express')();
    config.auth = { secret: 'secret', getIdentity: getIdentity };
    mobileApp = require('../../../src/express')(config);

    mobileApp.api.import('../files/api/customapi');
    mobileApp.api.import('../files/api/authapi');
    app.use(mobileApp);

describe('azure-mobile-apps.express.integration.customapi', function () {
    it('returns 200 on existing verb', function () {
        return request(app).get('/api/customapi').expect(200);
    });

    it('returns 404 on non-existent verb', function () {
        return request(app).post('/api/customapi').expect(404);
    });

    it('returns 401 on authorized verb', function () {
        return request(app).delete('/api/customapi').expect(401);
    });

    it('returns 200 on authorized verb when authorized', function () {
        return request(app).delete('/api/customapi')
            .set('x-zumo-auth', token)
            .expect(200);
    });

    it('returns 404 on unsupported verbs', function () {
        return request(app).trace('/api/customapi').expect(404);
    });

    it('correctly imports middleware array', function () {
        return request(app).put('/api/customapi')
            .set('x-zumo-auth', token)
            .expect('customapi', 'true')
            .expect(200);
    });

    it('returns correct options on preflight', function () {
        return request(app).options('/api/customapi')
            .expect('allow', 'GET,HEAD,PUT,DELETE')
            .expect(200);
    });

    it('returns 401 on all verbs of authorized api', function () {
        return request(app).get('/api/authapi').expect(401)
            .then(function () {
                return request(app).delete('/api/authapi').expect(401);
            });
    });
});

function getIdentity(authConfiguration, token, provider) {
    return { provider: provider };
}