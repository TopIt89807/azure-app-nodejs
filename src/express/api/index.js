// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express/api
@description This module contains functionality for adding custom apis to an Azure
Mobile App. It returns a router that can be attached to an express app with
some additional functions for registering apis.
*/
var express = require('express'),
    importScript = require('../script/import'),
    logger = require('../../logger'),
    assert = require('../../utilities/assert').argument,
    authorize = require('../middleware/authorize'),
    notAllowed = require('../middleware/notAllowed'),
    utilities = require('../../utilities'),
    setAccess = require('../script/setAccess'),
    supportedVerbs = ['get', 'post', 'put', 'patch', 'delete'];

/**
Create an instance of an express router for routing and handling api requests.
@param {configuration} configuration
@returns An express router with additional members described below.
*/
module.exports = function (configuration) {
    var router = express.Router();

    /**
    Register a single api with the specified definition.
    @function add
    @param {string} name - The name of the api. HTTP operations will be exposed on this route.
    @param {apiDefinition} definition - The definition for the api
    */
    router.add = function (name, definition) {
        assert(name, 'An api name was not specified');
        definition.name = name;
        router.use('/' + name, buildApiRouter(definition));
    };

    /**
    Import a file or folder of modules containing api definitions
    @function import
    @param {string} path Path to a file or folder containing modules that export a {@link apiDefinition}
    The path is relative to configuration.basePath that defaults to the location of your startup module.
    The api name will be derived from the physical file name.
    */
    router.import = importScript(configuration.basePath, router.add);

    return router;

    function buildApiRouter(definition) {
        var apiRouter = express.Router();
        Object.getOwnPropertyNames(definition).forEach(function (method) {
            if (supportedVerbs.some(function (verb) { return verb === method; })) {
                logger.debug("Adding method " + method + " to api " + definition.name);
                apiRouter[method]('/', buildMethodMiddleware(definition, method));
            } else if (method !== 'authorize') {
                logger.warn("Unrecognized property '" + method + "' in api " + definition.name);
            }
        });
        return apiRouter;
    }

    // definition is an api definition object
    // returns a middleware function or an array of middleware function
    function buildMethodMiddleware(definition, method) {
        setAccess(definition, method);

        if (definition[method].disable)
            return notAllowed(method);

        // method definitions are either a function, an array of functions, or an array-like object
        // if array-like object convert to array
        // {'0': addHeader, '1': return200, authorize: true} should convert to [addHeader,return200]
        var middleware = utilities.object.convertArrayLike(definition[method]);

        if (definition[method].authorize) {
            logger.debug("Adding authorization to " + method + " for api " + definition.name);
            middleware = [authorize].concat(middleware);
        }

        return middleware; 
    }
}
