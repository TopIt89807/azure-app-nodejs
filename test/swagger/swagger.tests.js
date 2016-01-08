// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    swagger = require('../../src/swagger'),
    api = require('../../src/swagger/tableApi'),
    model = require('../../src/swagger/tableModel'),

    table = { name: 'todoitem' },
    schema = {
        name: 'todoitem',
        properties: [
            { name: 'number', type: 'number' },
            { name: 'boolean', type: 'boolean' },
            { name: 'string', type: 'string' },
            { name: 'datetime', type: 'datetime' },
        ]
    },
    configuration = {
        tableRootPath: '/tables',
        tables: { todoitem: table }
    };

describe('azure-mobile-apps.swagger', function () {
    it("generates basic swagger structure", function () {
        expect(swagger(configuration)('http://localhost/', [schema])).to.containSubset({
            "swaggerVersion": "1.2",
            "basePath": "http://localhost/",
            "apis": [],
            "models": {}
        });
    });

    describe('tables.api', function () {
        it("generates API definitions for tables", function () {
            expect(api(configuration)(table)).to.containSubset({
                path: '\\tables\\todoitem\\{id}', // Backslash... WTF???
                operations: [
                    { method: 'GET', parameters: [ { name: "id" } ] },
                    { method: 'GET', },
                    { method: 'POST', },
                    { method: 'PATCH', },
                    { method: 'DELETE', parameters: [ { name: "id" } ] },
                    { method: 'POST', parameters: [ { name: "id" } ] }
                ]
            });
        });
    });

    describe('tables.model', function () {
        it("generates model definition for tables from columns", function () {
            expect(model(configuration)(table, schema)).to.containSubset({
                id: 'todoitem',
                properties: {
                    'number': { type: 'number', format: 'float' },
                    'boolean': { type: 'boolean' },
                    'string': { type: 'string' },
                    'datetime': { type: 'string', format: 'date-time' },
                }
            });
        });
    });
});
