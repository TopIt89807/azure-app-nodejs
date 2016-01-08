// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    swagger = require('../../src/swagger'),
    path = require('../../src/swagger/tablePath'),
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
        it("generates path object for tables", function () {
            expect(path(configuration)(table)).to.containSubset({
                get: { parameters: [ { name: "id" } ] },
                post: { parameters: [ { name: "id" }, { in: 'body' } ] },
                patch: { parameters: [ { in: 'body' } ]},
                delete: { parameters: [ { name: "id" } ] },
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
