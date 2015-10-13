// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var parseQuery = require('../middleware/parseQuery'),
    parseItem = require('../middleware/parseItem'),
    authorise = require('../middleware/authorise');

module.exports = function (configuration, router, executeOperation) {
    var defaultRoute = '/',
        idRoute = '/:id';

    // add operation specific middleware configured by the user
    configureOperation('read', 'get', [parseQuery(configuration)], [defaultRoute, idRoute]);
    configureOperation('insert', 'post', [parseItem(configuration)], [defaultRoute]);
    configureOperation('insert', 'post', [parseQuery(configuration)], [idRoute]); // post with an ID is an undelete operation
    configureOperation('update', 'patch', [parseItem(configuration)], [defaultRoute, idRoute]);
    configureOperation('delete', 'delete', [parseQuery(configuration)], [defaultRoute, idRoute]);

    // return table specific middleware configured by the user - if no execute middleware has been configured, just return the router we configured
    return !configuration.middleware.execute || configuration.middleware.execute.length === 0
        ? [router]
        : configuration.middleware.execute;

    function configureOperation(operation, verb, pre, routes) {
        var operationMiddleware = configuration.middleware[operation] || [],
            // if no middleware has been configured, just use the executeOperation middleware
            middleware = operationMiddleware.length === 0
                ? [executeOperation]
                : operationMiddleware;

        // hook up the authorise middleware if specified
        if (configuration.authorise || (configuration[operation] && configuration[operation].authorise)) middleware.unshift(authorise);

        if (pre) middleware.unshift.apply(middleware, pre);

        routes.forEach(function (route) {
            router[verb](route, middleware);
        });
    }
};
