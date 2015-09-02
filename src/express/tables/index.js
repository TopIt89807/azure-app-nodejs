// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express/tables
@description This module contains functionality for adding tables to an Azure
Mobile App. It returns middleware that can be attached to an express app with
some additional functions for registering tables.
*/
var loader = require('../../configuration/loader'),
    table = require('./table'),
    tableRouter = require('./tableRouter'),
    assert = require('../../utilities/assert').argument;

/**
Create an instance of an express middleware function for routing and handling table requests.
@param {configuration} configuration
@returns An express middleware function with additional members described below.
*/
module.exports = function (configuration) {
    configuration.tables = configuration.tables || {};

    var router = tableRouter(),
        middleware = function (req, res, next) {
            router(req, res, next);
        };

    /**
    Register a single table with the specified definition.
    @function add
    @param {string} name - The name of the table. HTTP operations will be exposed on this route.
    @param {tableDefinition|module:azure-mobile-apps/express/tables/table} definition - The definition for the table.
    */
    middleware.add = function (name, definition) {
        assert(name, 'A table name was not specified');
        if(!definition || !definition.createMiddleware)
            definition = table(definition);
        configuration.tables[name] = definition;
        router.add(name, definition);
    };

    /**
    Import a file or folder of modules containing table definitions
    @function import
    @param {string} path Path to a file or folder containing modules that export either a {@link tableDefinition} or
    {@link module:azure-mobile-apps/express/tables/table table object}.
    The path is relative to configuration.basePath that defaults to the location of your startup module.
    The table name will be derived from the physical file name.
    */
    middleware.import = function (path) {
        assert(path, 'A path to table configuration file(s) was not specified');
        var tables = loader.loadPath(path, configuration.basePath);
        Object.keys(tables).forEach(function (tableName) {
            var definition = tables[tableName];

            // the default module.exports (i.e. empty file) is an empty object
            // we need to convert this back to undefined for middleware.add
            if(definition && Object.keys(definition).length === 0)
                definition = undefined;

            middleware.add(tableName, definition);
        });
    };

    // expose configuration through zumoInstance.tables.configuration
    middleware.configuration = configuration.tables;

    middleware.stack = router.stack;

    return middleware;
}
