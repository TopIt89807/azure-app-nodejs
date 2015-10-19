// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express/tables
@description This module contains functionality for adding tables to an Azure
Mobile App. It returns a router that can be attached to an express app with
some additional functions for registering tables.
*/
var express = require('express'),
    loader = require('../../configuration/loader'),
    table = require('./table'),
    logger = require('../../logger'),
    assert = require('../../utilities/assert').argument;

/**
Create an instance of an express router for routing and handling table requests.
@param {configuration} configuration
@returns An express router with additional members described below.
*/
module.exports = function (configuration) {
    configuration.tables = configuration.tables || {};

    var router = express.Router();

    /**
    Register a single table with the specified definition.
    @function add
    @param {string} name - The name of the table. HTTP operations will be exposed on this route.
    @param {tableDefinition|module:azure-mobile-apps/express/tables/table} definition - The definition for the table.
    */
    router.add = function (name, definition) {
        assert(name, 'A table name was not specified');

        // if the definition doesn't have a router function, wrap it in a table definition object
        if(!definition || typeof definition.router !== 'function')
            definition = table(definition);

        if (configuration.data && !definition.hasOwnProperty('dynamicSchema'))
            definition.dynamicSchema = configuration.data.dynamicSchema;
        if (configuration.data && !definition.hasOwnProperty('schema'))
            definition.schema = configuration.data.schema;

        configuration.tables[name] = definition;

        logger.debug("Adding table definition for " + name);
        router.use('/' + name, definition.router(name));
    };

    /**
    Import a file or folder of modules containing table definitions
    @function import
    @param {string} path Path to a file or folder containing modules that export either a {@link tableDefinition} or
    {@link module:azure-mobile-apps/express/tables/table table object}.
    The path is relative to configuration.basePath that defaults to the location of your startup module.
    The table name will be derived from the physical file name.
    */
    router.import = function (path) {
        assert(path, 'A path to table configuration file(s) was not specified');
        var tables = loader.loadPath(path, configuration.basePath);
        Object.keys(tables).forEach(function (tableName) {
            var definition = tables[tableName];

            // the default module.exports (i.e. empty file) is an empty object
            // we need to convert this back to undefined for router.add
            if(definition && Object.keys(definition).length === 0)
                definition = undefined;

            if (definition && definition.name)
                tableName = definition.name;

            router.add(tableName, definition);
        });
    };

    // expose configuration through zumoInstance.tables.configuration
    router.configuration = configuration.tables;

    return router;
}
