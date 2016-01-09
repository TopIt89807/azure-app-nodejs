// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var ODataParameters = require('./ODataParameters');

module.exports = function (configuration) {
    return function (schema) {
        var paths = {};

        paths['/tables/' + schema.name] = {
            get: createOperation({
                summary: 'Query the ' + schema.name + ' table',
                description: 'The provided OData query is evaluated and an array of ' + schema.name + ' objects is returned. If no OData query is specified, all items are returned.',
                odata: true,
                responses: {
                    '200': createResponse('An array of items matching the provided query', 'array')
                }
            }),
            post: createOperation({
                summary: 'Insert a record into the ' + schema.name + ' table',
                parameters: ['body'],
                responses: {
                    '200': createResponse('The inserted item', 'item'),
                    '409': createResponse('An item with the same ID already exists', 'item')
                }
            }),
            patch: createOperation({
                summary: 'Update a record in the ' + schema.name + ' table',
                parameters: ['body'],
                responses: {
                    '200': createResponse('The updated item', 'item'),
                    '409': createResponse('A concurrency violation occurred', 'item'),
                    '412': createResponse('A concurrency violation occurred', 'item')
                }
            })
        }

        paths['/tables/' + schema.name + '/{id}'] = {
            get: createOperation({
                summary: 'Find a specific record in the ' + schema.name + ' table',
                description: 'Return the ' + schema.name + ' object is returned that corresponds with the provided id.',
                parameters: ['id'],
                responses: {
                    '200': createResponse('The request item', 'item')
                }
            }),
            post: createOperation({
                summary: 'Undelete a record from the ' + schema.name + ' table',
                parameters: ['id'],
                responses: {
                    '200': createResponse('The undeleted item', 'item'),
                    '409': createResponse('A concurrency violation occurred', 'item'),
                    '412': createResponse('A concurrency violation occurred', 'item')
                }
            }),
            patch: createOperation({
                summary: 'Update a record in the ' + schema.name + ' table',
                parameters: ['id', 'body'],
                responses: {
                    '200': createResponse('The updated item', 'item'),
                    '409': createResponse('A concurrency violation occurred', 'item'),
                    '412': createResponse('A concurrency violation occurred', 'item')
                }
            }),
            delete: createOperation({
                summary: 'Delete a record from the ' + schema.name + ' table',
                parameters: ['id'],
                responses: {
                    '200': createResponse('The deleted item', 'item'),
                    '409': createResponse('A concurrency violation occurred', 'item'),
                    '412': createResponse('A concurrency violation occurred', 'item')
                }
            })
        };

        return paths;

        function createOperation(options) { //summary, description, parameters, odata, responses
            options.parameters = options.parameters || [];
            options.responses = options.responses || {};

            options.responses['400'] = createResponse('The format of the request was incorrect', 'error');
            options.responses['404'] = createResponse('The table or item could not be found', 'error');
            options.responses['500'] = createResponse('An internal error occurred', 'error');

            var operation = {
                tags: [schema.name],
                summary: options.summary,
                description: options.description,
                parameters: options.parameters.map(createParameter),
                responses: options.responses
            };

            if(options.odata)
                operation.parameters = operation.parameters.concat(ODataParameters);

            operation.parameters = operation.parameters.concat(createParameter('apiVersion'));

            return operation;
        }

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
                    name: "body",
                    description: "The item",
                    required: true,
                    schema: {
                        $ref: "#/definitions/" + schema.name
                    },
                    in: "body"
                },
                'apiVersion': {
                    name: "zumo-api-version",
                    description: "The Azure Mobile Apps API version",
                    required: true,
                    type: "string",
                    in: "header",
                    default: configuration.apiVersion
                }
            })[name];
        }

        function createResponse(description, type) {
            return {
                description: description,
                schema: getSchema()
            };

            function getSchema() {
                return ({
                    'item': { $ref: '#/definitions/' + schema.name },
                    'array': { type: 'array', items: { $ref: '#/definitions/' + schema.name } },
                    'error': undefined //{ $ref: '#/definitions/errorType' }
                })[type];
            }
        }
    }
}
