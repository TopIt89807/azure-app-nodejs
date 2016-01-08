// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var tableApi = require('./tableApi'),
    tableModel = require('./tableModel'),
    object = require('../utilities/object'),
    data = require('../data');

module.exports = function (configuration) {
    var tableApiDefinition = tableApi(configuration),
        tableModelDefinition = tableModel(configuration),
        tables = object.values(configuration.tables),
        dataProvider = data(configuration);

    return function (baseUrl, tableSchemas) {
        return {
            swaggerVersion: "1.2",
            basePath: baseUrl,
            apis: tables.map(tableApiDefinition),
            models: tableSchemas.reduce(function (models, schema) {
                models[schema.name] = tableModelDefinition(configuration.tables[schema.name], schema);
                return models;
            }, {})
        };
    };
};
