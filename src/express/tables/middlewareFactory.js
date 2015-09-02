// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var parseQuery = require('../middleware/parseQuery'),
    parseItem = require('../middleware/parseItem'),
    renderResults = require('../middleware/renderResults'),
    authorise = require('../middleware/authorise');

module.exports = function (configuration, router, executeOperation) {
    var defaultRoute = '/' + configuration.name,
        idRoute = '/' + configuration.name + '/:id';

    // add operation specific middleware configured by the user
    configureOperation('read', 'get', [parseQuery(configuration)], [renderResults], [defaultRoute, idRoute]);
    configureOperation('insert', 'post', [parseItem(configuration)], [renderResults], [defaultRoute]);
    configureOperation('insert', 'post', [parseQuery(configuration)], [renderResults], [idRoute]); // post with an ID is an undelete operation
    configureOperation('update', 'patch', [parseItem(configuration)], [renderResults], [defaultRoute, idRoute]);
    configureOperation('delete', 'delete', [parseQuery(configuration)], [renderResults], [defaultRoute, idRoute]);

    // return table specific middleware configured by the user - if no execute middleware has been configured, just return the router we configured
    return !configuration.middleware.execute || configuration.middleware.execute.length === 0
        ? [router]
        : configuration.middleware.execute;

    function configureOperation(operation, verb, pre, post, routes) {
        var operationMiddleware = configuration.middleware[verb] || [],
            // if no middleware has been configured, just use the executeOperation middleware
            middleware = operationMiddleware.length === 0
                ? [executeOperation]
                : operationMiddleware;

        // hook up the authorise middleware if specified
        if (configuration.authorise || (configuration[operation] && configuration[operation].authorise)) middleware.unshift(authorise);

        if (pre) middleware.unshift.apply(middleware, pre);
        if (post) middleware.push.apply(middleware, post);

        routes.forEach(function (route) {
            router[verb](route, middleware);
        })
    }
};
