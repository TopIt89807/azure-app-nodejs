// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
The azure-mobile-apps module is the Nodejs implementation of Azure Mobile Apps
@module azure-mobile-apps
@see {@link http://azure.microsoft.com/en-us/services/app-service/mobile/ Azure Mobile Apps}
*/

var loadConfiguration = require('./configuration'),
    environment = require('./utilities/environment'),
    table = require('./express/tables/table'),
    logger = require('./logger'),
    promises = require('./utilities/promises'),
    merge = require('deeply'),
    path = require('path'),

    platforms = {
        express: require('./express'),
    },

    defaults = {
        platform: 'express',
        basePath: path.dirname(module.parent.filename),
        configFile: 'azureMobile',
        promiseConstructor: Promise,
        apiRootPath: '/api',
        tableRootPath: '/tables',
        notificationRootPath: '/push/installations',
        debug: environment.debug,
        version: 'node-' + require('../package.json').version,
        maxTop: 1000,
        pageSize: 50,
        logging: {
            level: environment.debug ? 'debug' : 'info',
            transports: {
                Console: {
                    colorize: true,
                    timestamp: true,
                    showLevel: true
                }
            }
        },
        cors: {
            maxAge: 300,
            origins: ['localhost']
        },
        data: {
            provider: 'memory',
            schema: 'dbo',
            dynamicSchema: true
        },
        notifications: { },
        auth: { }
    };

/**
Creates an instance of the azure-mobile-apps server object for the platform specified in the configuration.
Express 4.x is currently the only supported platform.
@param {configuration} configuration Top level configuration for all aspects of the mobile app
@param {object} environment=process.env An object containing the environment to load configuration from
@returns {module:azure-mobile-apps/express}
*/
module.exports = function (configuration, environment) {
    configuration = configuration || {};
    var configFile = path.resolve(configuration.basePath || defaults.basePath, configuration.configFile || defaults.configFile);
    configuration = merge({ logging: {}, data: {}, auth: {} }, defaults, loadConfiguration.fromFile(configFile), configuration);
    loadConfiguration.fromEnvironment(configuration, environment || process.env);
    loadConfiguration.fromSettingsJson(configuration);
    
    promises.setConstructor(configuration.promiseConstructor);

    return platforms[configuration.platform](configuration);
};

module.exports.table = table;
