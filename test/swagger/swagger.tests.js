// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    swagger = require('../../src/swagger'),
    paths = require('../../src/swagger/tablePaths'),
    definition = require('../../src/swagger/tableDefinition'),

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
        expect(swagger(configuration)('/', [schema])).to.containSubset({
            "swagger": "2.0",
            "basePath": "/",
            "info": {},
            "tags": {},
            "paths": {},
            "definitions": { errorType: {} }
        });
    });

    describe('tables.path', function () {
        it("generates path objects for tables", function () {
            expect(paths(configuration)(table)).to.containSubset({
                '/tables/todoitem': {
                    get: { parameters: [ { name: "$filter" }, { name: "zumo-api-version" } ], responses: {} },
                    post: { parameters: [ { in: 'body' }, { name: "zumo-api-version" } ], responses: {} },
                    patch: { parameters: [ { in: 'body' }, { name: "zumo-api-version" } ], responses: {} },
                },
                '/tables/todoitem/{id}': {
                    get: { parameters: [ { name: "id" }, { name: "zumo-api-version" } ], responses: {} },
                    post: { parameters: [ { name: "id" }, { name: "zumo-api-version" } ], responses: {} },
                    patch: { parameters: [ { name: "id" }, { in: 'body' }, { name: "zumo-api-version" } ], responses: {}},
                    delete: { parameters: [ { name: "id" }, { name: "zumo-api-version" } ], responses: {} }
                }
            });
        });
    });

    describe('tables.definition', function () {
        it("generates definition object for tables from columns", function () {
            expect(definition(configuration)(table, schema)).to.containSubset({
                type: 'object',
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
