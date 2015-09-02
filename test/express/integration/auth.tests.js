// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../src/express'),
    auth = require('../../../src/auth')({ secret: 'secret' }),
    secret = 'secret',
    token = auth.sign({ "uid": "Facebook:someuserid@hotmail.com" }),

    app, mobileApp;

// the default configuration uses the in-memory data provider - it does not (yet) support queries
describe('azure-mobile-apps.express.integration.auth', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps({ auth: { secret: secret, getIdentity: getIdentity } });
    });

    it('returns 200 for table requests with valid auth token', function () {
        mobileApp.tables.add('todoitem');
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .set('x-zumo-auth', token)
            .expect(200);
    });

    it('returns 200 for table requests with no auth token', function () {
        mobileApp.tables.add('todoitem');
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(200);
    });

    it('returns 401 for table requests with invalid auth token', function () {
        mobileApp.tables.add('todoitem');
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .set('x-zumo-auth', 'invalid token')
            .expect(401);
    });

    it('returns 401 for table requests against authorised table with no token', function () {
        mobileApp.tables.add('todoitem', { authorise: true });
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(401);
    });

    it('returns 200 for table requests against authorised table with valid token', function () {
        mobileApp.tables.add('todoitem', { authorise: true });
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .set('x-zumo-auth', token)
            .expect(200);
    });

    it('attaches user object to context object', function () {
        var table = mobileApp.table();
        table.authorise = true;
        table.read(function (context) {
            return [context.user.id];
        });
        mobileApp.tables.add('todoitem', table);
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .set('x-zumo-auth', token)
            .expect(200)
            .then(function (response) {
                expect(response.body).to.deep.equal(['Facebook:someuserid@hotmail.com']);
            });
    });

    it('attaches getIdentity function to user object', function () {
        var table = mobileApp.table();
        table.authorise = true;
        table.read(function (context) {
            return [context.user.getIdentity('provider')];
        });
        mobileApp.tables.add('todoitem', table);
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .set('x-zumo-auth', token)
            .expect(200)
            .then(function (response) {
                expect(response.body).to.deep.equal([{ provider: 'provider' }]);
            });
    });

    it('authorises all operations against a table when specified', function () {
        mobileApp.tables.add('todoitem', { authorise: true });
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(401)
            .then(function () {
                return supertest(app)
                    .post('/tables/todoitem')
                    .expect(401);
            })
            .then(function () {
                return supertest(app)
                    .delete('/tables/todoitem')
                    .expect(401);
            })
            .then(function () {
                return supertest(app)
                    .patch('/tables/todoitem')
                    .expect(401);
            });
    });

    it('authorises specific operations against a table when specified', function () {
        var table = mobileApp.table();
        table.insert.authorise = true;
        table.update.authorise = true;
        mobileApp.tables.add('todoitem', table);
        mobileApp.attach(app);

        return supertest(app)
            .get('/tables/todoitem')
            .expect(200)
            .then(function () {
                return supertest(app)
                    .post('/tables/todoitem')
                    .expect(401);
            })
            .then(function () {
                return supertest(app)
                    .delete('/tables/todoitem')
                    .expect(200);
            })
            .then(function () {
                return supertest(app)
                    .patch('/tables/todoitem')
                    .expect(401);
            });
    });

    function getIdentity(authConfiguration, token, provider) {
        return { provider: provider };
    }
});
