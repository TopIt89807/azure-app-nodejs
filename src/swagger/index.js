// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var tableDefinition = require('./tableDefinition'),
    tablePaths = require('./tablePath'),
    tableTag = require('./tableTag'),
    object = require('../utilities/object'),
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
            tags: tables.map(createTableTag),
            paths: tableSchemas.reduce(function (paths, schema) {
                paths['/tables/' + schema.name] = createTablePaths(schema);
                return paths;
            }, {}),
            definitions: tableSchemas.reduce(function (definitions, schema) {
                definitions[schema.name] = createTableDefinition(configuration.tables[schema.name], schema);
                return definitions;
            }, {})
        };
    };
};
