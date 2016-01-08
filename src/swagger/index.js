// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var tableDefinition = require('./tableDefinition'),
    tablePaths = require('./tablePaths'),
    tableTag = require('./tableTag'),
    object = require('../utilities/object'),
    merge = require('deeply'),
    data = require('../data');

module.exports = function (configuration) {
    var createTableDefinition = tableDefinition(configuration),
        createTablePaths = tablePaths(configuration),
        createTableTag = tableTag(configuration),
        tables = object.values(configuration.tables),
        dataProvider = data(configuration);

    return function (basePath, tableSchemas) {
        return {
            swagger: "2.0",
            basePath: basePath,
            info: { title: configuration.name || 'Azure Mobile App' },
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
