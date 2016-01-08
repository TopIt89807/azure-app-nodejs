var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../infrastructure/mobileApps'),
    app, mobileApp;

describe('azure-mobile-apps.express.integration.swagger', function () {
    beforeEach(function () {
        app = express();
        mobileApp = mobileApps({ swagger: true });
    });

    it("generates basic API definitions for tables", function () {
        mobileApp.tables.add('todoitem');
        app.use(mobileApp);

        return supertest(app)
            .get('/swagger')
            .expect(200)
            .expect(function (res) {
                expect(res.body).to.containSubset({
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
                });
            });
    });
});
