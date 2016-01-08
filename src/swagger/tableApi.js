// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var path = require('path')

module.exports = function (configuration) {
    return function (table) {
        return {
            path: path.normalize(configuration.tableRootPath + '/' + table.name + '/{id}'),
            operations: [
                {
                    method: 'GET',
                    summary: 'Return the record specified by the id parameter from the ' + table.name + ' table',
                    type: table.name,
                    parameters: [
                        {
                            name: "id",
                            description: "The record identifier",
                            required: false,
                            type: "string",
                            paramType: "path"
                        }
                    ]
                }, {
                    method: 'POST',
                    summary: 'Insert a record into the ' + table.name + ' table',
                    type: table.name
                }, {
                    method: 'PATCH',
                    summary: 'Update a record in the ' + table.name + ' table',
                    type: table.name
                }, {
                    method: 'DELETE',
                    summary: 'Delete a record from the ' + table.name + ' table',
                    type: table.name,
                    parameters: [
                        {
                            name: "id",
                            description: "The record identifier",
                            required: true,
                            type: "string",
                            paramType: "path"
                        }
                    ]
                }, {
                    method: 'POST',
                    summary: 'Undelete a record from the ' + table.name + ' table',
                    type: table.name,
                    parameters: [
                        {
                            name: "id",
                            description: "The record identifier",
                            required: true,
                            type: "string",
                            paramType: "path"
                        }
                    ]
                }
            ]
        };
    };
};
