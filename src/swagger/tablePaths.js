// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var ODataParameters = require('./ODataParameters');

module.exports = function (configuration) {
    return function (schema) {
        var paths = {};

        paths['/tables/' + schema.name] = {
            get: {
                tags: [schema.name],
                summary: 'Query the ' + schema.name + ' table',
                description: 'The provided OData query is evaluated and an array of ' + schema.name + ' objects is returned. If no OData query is specified, all items are returned.',
                parameters: [{
                    name: "id",
                    description: "The record identifier",
                    required: false,
                    type: "string",
                    in: "path"
                }].concat(ODataParameters)
            },
            post: {
                tags: [schema.name],
                summary: 'Insert a record into the ' + schema.name + ' table',
                description: '',
                parameters: [
                    {
                        description: "The item to insert",
                        required: false,
                        schema: {
                            $ref: "#/definitions/" + schema.name
                        },
                        in: "body"
                    }
                ]
            },
            patch: {
                tags: [schema.name],
                summary: 'Update a record in the ' + schema.name + ' table',
                parameters: [
                    {
                        description: "The item to insert",
                        required: false,
                        schema: {
                            $ref: "#/definitions/" + schema.name
                        },
                        in: "body"
                    }
                ]
            }
        }

        paths['/tables/' + schema.name + '/{id}'] = {
            get: {
                tags: [schema.name],
                summary: 'Query the ' + schema.name + ' table',
                description: 'Return the ' + schema.name + ' object is returned that corresponds with the provided id.',
                parameters: [{
                    name: "id",
                    description: "The record identifier",
                    required: false,
                    type: "string",
                    in: "path"
                }].concat(ODataParameters)
            },
            post: {
                tags: [schema.name],
                summary: 'Undelete a record from the ' + schema.name + ' table',
                parameters: [
                    {
                        name: "id",
                        description: "The record identifier to undelete",
                        required: false,
                        type: "string",
                        in: "path"
                    }
                ]
            },
            patch: {
                tags: [schema.name],
                summary: 'Update a record in the ' + schema.name + ' table',
                parameters: [
                    {
                        name: "id",
                        description: "The record identifier to undelete",
                        required: false,
                        type: "string",
                        in: "path"
                    }, {
                        description: "The item to insert",
                        required: false,
                        schema: {
                            $ref: "#/definitions/" + schema.name
                        },
                        in: "body"
                    }
                ]
            },
            delete: {
                tags: [schema.name],
                summary: 'Delete a record from the ' + schema.name + ' table',
                parameters: [
                    {
                        name: "id",
                        description: "The record identifier",
                        required: true,
                        type: "string",
                        in: "path"
                    }
                ]
            }
        };

        return paths;
    }
}
