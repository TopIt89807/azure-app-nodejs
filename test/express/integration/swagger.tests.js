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

    it("exposes swagger-ui", function () {
        mobileApp = mobileApps({ swagger: true });
        app.use(mobileApp);

        return supertest(app)
            .get('/swagger/ui/?url=http://localhost/swagger')
            .expect(200);
    });

    var metadataSubset = {
        apis: [{
            path: '\\tables\\todoitem\\{id}',
            operations: [
                { method: 'GET', parameters: [ { name: "id" } ] },
                { method: 'GET', },
                { method: 'POST', },
                { method: 'PATCH', },
                { method: 'DELETE', parameters: [ { name: "id" } ] },
                { method: 'POST', parameters: [ { name: "id" } ] }
            ]
        }],
        models: {
            todoitem: {
                id: 'todoitem',
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
