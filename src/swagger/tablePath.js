// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = function (configuration) {
    return function (schema) {
        return {
            get: {
                tags: [schema.name],
                summary: 'Query the ' + schema.name + ' table',
                description: 'If the id querystring parameter is provided, a single ' + schema.name + ' object is returned that corresponds with the provided id. Otherwise, the OData query is evaluated and an array of ' + schema.name + ' objects is returned. If no OData query is specified, all items are returned.',
                parameters: [
                    {
                        name: "id",
                        description: "The record identifier",
                        required: false,
                        type: "string",
                        in: "path"
                    }, {
                        name: "$filter",
                        description: "OData filter clause",
                        required: false,
                        type: "string",
                        in: "query"
                    }, {
                        name: "$orderby",
                        description: "OData order by clause",
                        required: false,
                        type: "string",
                        in: "query"
                    }, {
                        name: "$skip",
                        description: "OData skip clause",
                        required: false,
                        type: "integer",
                        in: "query"
                    }, {
                        name: "$top",
                        description: "OData top clause",
                        required: false,
                        type: "integer",
                        in: "query"
                    }, {
                        name: "$select",
                        description: "OData select clause",
                        required: false,
                        type: "string",
                        in: "query"
                    }, {
                        name: "$inlinecount",
                        description: "OData inline count clause",
                        required: false,
                        type: "string",
                        in: "query"
                    }
                ]
            },
            post: {
                tags: [schema.name],
                summary: 'Insert a record into the ' + schema.name + ' table, or undelete a record from it',
                description: 'If the id querystring parameter is provided, the operation is an undelete operation.',
                parameters: [
                    {
                        name: "id",
                        description: "The record identifier",
                        required: false,
                        type: "string",
                        in: "path"
                    },
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
        }
    }
}
