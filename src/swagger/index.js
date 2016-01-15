// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var tableDefinition = require('./tableDefinition'),
    tablePaths = require('./tablePaths'),
    tableTag = require('./tableTag'),
    object = require('../utilities/object'),
    merge = require('deeply');

module.exports = function (configuration) {
    var createTableDefinition = tableDefinition(configuration),
        createTablePaths = tablePaths(configuration),
        createTableTag = tableTag(configuration),
        tables = object.values(configuration.tables);

    return function (basePath, host, tableSchemas) {
        return {
            swagger: "2.0",
            basePath: basePath,
            host: host,
            consumes: ['application/json'],
            produces: ['application/json'],
            info: {
                title: configuration.name || 'Azure Mobile App',
                version: configuration.apiVersion
            },
            tags: tables.map(createTableTag),
            paths: tableSchemas.reduce(function (paths, schema) {
                paths = merge(paths, createTablePaths(schema));
                return paths;
            }, {}),
            definitions: tableSchemas.reduce(function (definitions, schema) {
                definitions[schema.name] = createTableDefinition(configuration.tables[schema.name], schema);
                return definitions;
            }, { errorType: errorDefinition() })
        };

        function errorDefinition() {
            return {
                type: 'object',
                properties: {
                    error: { type: 'string', description: 'The error message' },
                    stack: { type: 'string', description: 'If debug mode is enabled, the stack trace for the error' }
                }
            };
        }
    };
};
