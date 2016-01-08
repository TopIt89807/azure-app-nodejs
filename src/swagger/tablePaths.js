// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var ODataParameters = require('./ODataParameters');

module.exports = function (configuration) {
    return function (schema) {
        var paths = {};

        paths['/tables/' + schema.name] = {
            get: createOperation(
                'Query the ' + schema.name + ' table',
                'The provided OData query is evaluated and an array of ' + schema.name + ' objects is returned. If no OData query is specified, all items are returned.',
                [], true),
            post: createOperation('Insert a record into the ' + schema.name + ' table', undefined, ['body']),
            patch: createOperation('Update a record in the ' + schema.name + ' table', undefined, ['body'])
        }

        paths['/tables/' + schema.name + '/{id}'] = {
            get: createOperation(
                'Query the ' + schema.name + ' table',
                'Return the ' + schema.name + ' object is returned that corresponds with the provided id.',
                ['id'], true),
            post: createOperation('Undelete a record from the ' + schema.name + ' table', undefined, ['id']),
            patch: createOperation('Update a record in the ' + schema.name + ' table', undefined, ['id', 'body']),
            delete: createOperation('Delete a record from the ' + schema.name + ' table', undefined, ['id'])
        };

        return paths;

        function createOperation(summary, description, parameters, odata) {
            var operation = {
                tags: [schema.name],
                summary: summary,
                description: description,
                parameters: parameters.map(createParameter)
            };

            if(odata)
                operation.parameters = operation.parameters.concat(ODataParameters);

            return operation;

            function createParameter(name) {
                return ({
                    'id': {
                        name: "id",
                        description: "The record identifier",
                        required: true,
                        type: "string",
                        in: "path"
                    },
                    'body': {
                        description: "The item",
                        required: true,
                        schema: {
                            $ref: "#/definitions/" + schema.name
                        },
                        in: "body"
                    }
                })[name];
            }
        }
    }
}
