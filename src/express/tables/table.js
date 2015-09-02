// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express/tables/table
@description This module provides functionality for configuring features of individual tables with an Azure Mobile App.
*/
var middlewareFactory = require('./middlewareFactory'),
    executeOperation = require('../middleware/executeOperation'),
    utilities = require('../../utilities'),
    express = require('express');

/**
Creates an instance of a table configuration helper.
@param {tableDefinition} definition Additional table options. These properties can also be specified directly on the helper object itself.
@returns An object with the members described below.
*/
module.exports = function (definition) {
    var router = express.Router();

    var table = utilities.assign({
        // calling this creates required middleware as configured
        createMiddleware: function (name) {
            table.name = name;
            return middlewareFactory(table, router, table.operation);
        }
    }, definition);

    table.middleware = { };
    table.operations = { };
    table.execute = router;
    table.operation = executeOperation(table.operations);

    /**
    Specify middleware to be executed for every request against the table
    @function use
    @param {function} middleware - An array or argument list of middleware to execute. This middleware must contain the middleware exposed through table.execute.
    */
    table.use = attachMiddleware('execute');

    /**
    Register a table read logic handler. The property also exposes a use function for specifying middleware for the read operation.
    Middleware must contain the middleware exposed through table.operation. You can also set the authorise property on this member.
    @function read
    @param {tableOperationHandler} handler - A function containing logic to execute each time a table read is performed.
    @example
var table = require('azure-mobile-apps/express').table();
table.read.authorise = true;
table.read.use(customMiddleware, table.operation);
table.read(function (context) {
    // add an additional query operator
    context.query.where({ property: 'value' });
    return context.execute();
});
    */
    table.read = attachOperation('get');

    /**
    @callback tableOperationHandler
    @param {context} context The current azure-mobile-apps context object
    */

    /**
    Identical syntax and semantics to the read function, but for update operations.
    @function update
    */
    table.update = attachOperation('patch');

    /**
    Identical syntax and semantics to the read function, but for insert operations.
    @function insert
    */
    table.insert = attachOperation('post');

    /**
    Identical syntax and semantics to the read function, but for delete operations.
    @function delete
    */
    table.delete = attachOperation('delete');

    return table;

    function attachMiddleware(verb) {
        return function (middleware) {
            table.middleware[verb] = table.middleware[verb] || [];
            Array.prototype.push.apply(table.middleware[verb], arguments);
        };
    }

    function attachOperation(verb) {
        var operation = function (handler) {
            table.operations[verb] = handler;
        };
        operation.use = attachMiddleware(verb);
        return operation;
    }
};
