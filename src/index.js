// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
The azure-mobile-apps module is the Nodejs implementation of Azure Mobile Apps
@module azure-mobile-apps
@see {@link http://azure.microsoft.com/en-us/services/app-service/mobile/ Azure Mobile Apps}
*/

var loadConfiguration = require('./configuration'),
    table = require('./express/tables/table'),
    logger = require('./logger'),
    promises = require('./utilities/promises'),
    query = require('./query'),

    platforms = {
        express: require('./express'),
    };

/**
Creates an instance of the azure-mobile-apps server object for the platform specified in the configuration.
The top level exported function creates an instance ready for local debugging and Azure hosted configurations.
Express 4.x is currently the only supported platform.
@param {configuration} configuration Top level configuration for all aspects of the mobile app
@param {object} environment=process.env An object containing the environment to load configuration from
@returns {module:azure-mobile-apps/express}
*/
var api = module.exports = function (configuration, environment) {
    return api.create(loadConfiguration.from()
        .defaults(configuration)
        .file()
        .environment(environment)
        .settingsJson()
        .object(configuration)
        .commandLine()
        .apply());
};

api.create = function (configuration) {
    return platforms[configuration.platform](configuration);
};

api.table = table;
api.logger = logger;
api.query = query;
api.promises = promises;

// this is purely a helper function to allow intellisense for custom API definitions
api.api = function (definition) { return definition; };
