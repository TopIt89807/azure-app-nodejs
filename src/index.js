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
    winston = require('winston'),

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
        authStubRoute: '/.auth/login/:provider',
        debug: environment.debug,
        version: 'node-' + require('../package.json').version,
        homePage: false,
        maxTop: 1000,
        pageSize: 50,
        logging: {
            level: environment.debug ? 'debug' : 'info',
            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    timestamp: true,
                    showLevel: true
                })
            ]
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
        auth: { secret: '0000', validateTokens: false },
        notifications: { }
    };

/**
Creates an instance of the azure-mobile-apps server object for the platform specified in the configuration.
Express 4.x is currently the only supported platform.
@param {configuration} configuration Top level configuration for all aspects of the mobile app
@param {object} environment=process.env An object containing the environment to load configuration from
@returns {module:azure-mobile-apps/express}
*/
var api = module.exports = function (configuration, environment) {
    configuration = configuration || {};
    var configFile = path.resolve(configuration.basePath || defaults.basePath, configuration.configFile || defaults.configFile);
    configuration = merge({ logging: {}, data: {}, auth: {} }, defaults, loadConfiguration.fromFile(configFile), configuration);
    loadConfiguration.fromEnvironment(configuration, environment || process.env);
    loadConfiguration.fromSettingsJson(configuration);

    return api.buildApp(configuration);
};

// encapsulates configuration of global modules to simplify test configuration
api.configureGlobals = function (configuration) {
    logger.configure(configuration.logging);
    promises.setConstructor(configuration.promiseConstructor);
};

api.buildApp = function (configuration) {
    api.configureGlobals(configuration);
    return platforms[configuration.platform](configuration);
};

api.defaultConfig = function () {
    return merge(defaults);
};

api.table = table;
