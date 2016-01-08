var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../infrastructure/mobileApps'),
    app, mobileApp;

describe('azure-mobile-apps.express.integration.swagger', function () {
    beforeEach(function () {
        app = express();
    });

    it("only exposes metadata if configured", function () {
        mobileApp = mobileApps();
        app.use(mobileApp);

        return supertest(app)
            .get('/swagger')
            .expect(404);
    });

    it("generates basic API definitions for tables", function () {
        mobileApp = mobileApps({ swagger: true });
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/swagger')
            .expect(200)
            .expect(function (res) {
                expect(res.body).to.containSubset(metadataSubset);
            });
    });

    it("redirects to swagger-ui with url", function () {
        mobileApp = mobileApps({ swagger: true });
        app.use(mobileApp);

        return supertest(app)
            .get('/swagger/ui')
            .expect(302);
    });

    it("exposes swagger-ui", function () {
        mobileApp = mobileApps({ swagger: true });
        app.use(mobileApp);

        return supertest(app)
            .get('/swagger/ui/?url=http://localhost/swagger')
            .expect(200);
    });

    var metadataSubset = {
        paths: {
            '/tables/todoitem': {
                get: { parameters: [ { name: 'id', in: 'path' } ] },
                post: { parameters: [ { name: 'id', in: 'path' }, { in: 'body' } ] },
                patch: { parameters: [ { in: 'body' } ]},
                delete: { parameters: [ { name: "id", in: 'path' } ] },
            }
        },
        definitions: {
            todoitem: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    version: { type: 'string' },
                    deleted: { type: 'boolean' }
                }
            }
        }
    };
});
