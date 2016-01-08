// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var tableApi = require('./tableApi'),
    tableModel = require('./tableModel'),
    object = require('../utilities/object');

module.exports = function (configuration) {
    var tableApiDefinition = tableApi(configuration),
        tableModelDefinition = tableModel(configuration),
        tables = object.values(configuration.tables);

    return function (baseUrl) {
        return {
            swaggerVersion: "1.2",
            basePath: baseUrl,
            apis: tables.map(tableApiDefinition),
            models: tables.reduce(function (models, table) {
                models[table.name] = tableModelDefinition();
                return models;
            })
        };
    };
};
