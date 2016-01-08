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
            "tags": {},
            "paths": {},
            "definitions": {}
        });
    });

    describe('tables.path', function () {
        it("generates path objects for tables", function () {
            expect(paths(configuration)(table)).to.containSubset({
                '/tables/todoitem': {
                    get: { parameters: [ { name: "$filter" } ] },
                    post: { parameters: [ { in: 'body' } ] },
                    patch: { parameters: [ { in: 'body' } ]},
                },
                '/tables/todoitem/{id}': {
                    get: { parameters: [ { name: "id" } ] },
                    post: { parameters: [ { name: "id" } ] },
                    patch: { parameters: [ { name: "id" }, { in: 'body' } ]},
                    delete: { parameters: [ { name: "id" } ] }
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
