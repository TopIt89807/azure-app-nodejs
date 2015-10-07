// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express
@description
This module is the entry point for adding an Azure Mobile App to an instance of
an express web server. It is returned from the root azure-mobile-apps module
when the configuration passed specifies the express platform.
*/
var express = require('express'),
    tables = require('./tables'),
    table = require('./tables/table'),
    notifications = require('./middleware/notifications'),
    createContext = require('./middleware/createContext'),
    authenticate = require('./middleware/authenticate'),
    handleError = require('./middleware/handleError'),
    crossOrigin = require('./middleware/crossOrigin'),
    renderResults = require('./middleware/renderResults'),
    version = require('./middleware/version'),
    log = require('../logger'),
    assert = require('../utilities/assert').argument;

/**
 * An {@link http://expressjs.com/4x/api.html#router express router} extended with the following properties
 * @typedef mobileAppRouter
 * @property {module:azure-mobile-apps/express/tables} tables - Contains functions to register table definitions with azure-mobile-apps
 * @property {module:azure-mobile-apps/express/tables/table} table - Factory function for creating table definition objects
 * @property {configuration} configuration - Top level configuration that azure-mobile-apps was configured with
 */

/**
 * Creates an instance of the azure-mobile-apps server object for express 4.x
 * @param {configuration} configuration
 * @returns {mobileAppRouter}
 */
module.exports = function (configuration) {
    configuration = configuration || {};
    configuration.data = configuration.data || { provider: 'memory' };
    var tableMiddleware = tables(configuration),
        notificationMiddleware = notifications(configuration),
        authMiddleware = authenticate(configuration),
        createContextMiddleware = createContext(configuration),
        handleErrorMiddleware = handleError(configuration),
        crossOriginMiddleware = crossOrigin(configuration),
        versionMiddleware = version(configuration),
        customMiddlewareRouter = express.Router(),
        mobileApp = express.Router();

    mobileApp.use(versionMiddleware)
        .use(createContextMiddleware)
        .use(authMiddleware)
        .use(crossOriginMiddleware)
        .use(customMiddlewareRouter)
        .use(notificationMiddleware)
        .use(configuration.tableRootPath || '/tables', tableMiddleware, renderResults)
        .use(handleErrorMiddleware);

    var api = function (req, res, next) {
        mobileApp(req, res, next);
    };

    api.tables = tableMiddleware;
    api.table = table;
    api.configuration = configuration;
    api.use = function () {
        customMiddlewareRouter.use.apply(customMiddlewareRouter, arguments);
    }

    return api;
};

/**
Static factory function for creating table definition objects. Intended to be used from imported table configuration files.
@function
@returns {module:azure-mobile-apps/express/tables/table}
@example require('azure-mobile-apps/express').table();
*/
module.exports.table = table;
