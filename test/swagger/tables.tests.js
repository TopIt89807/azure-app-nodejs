// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    swagger = require('../../src/swagger');

describe('azure-mobile-apps.swagger.tables', function () {
    it("generates API definitions for tables", function () {
        expect(swagger({
            tableRootPath: '/tables',
            tables: [
                { name: 'todoitem' }
            ]
        })().apis).to.containSubset([{
            path: '\\tables\\todoitem\\{id}', // WTF???
            operations: [
                {
                    method: 'GET',
                    parameters: [
                        {
                            name: "id",
                        }
                    ]
                },
                { method: 'GET', },
                { method: 'POST', },
                { method: 'PATCH', },
                {
                    method: 'DELETE',
                    parameters: [
                        {
                            name: "id",
                        }
                    ]
                }, {
                    method: 'POST',
                    parameters: [
                        {
                            name: "id",
                        }
                    ]
                }
            ]
        }]);
    });
});
