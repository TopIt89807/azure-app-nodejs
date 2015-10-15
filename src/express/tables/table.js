// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/express/tables/table
@description
This module provides functionality for configuring features of individual tables with an Azure Mobile App.
The returned table object exposes functions for attaching middleware and operation functions, i.e. use, read, read.use, insert, insert.use, etc.
These functions populate the middleware and operations properties of the table object, which are then consumed by the attachRoutes module.
The router function calls the attachRoutes module and returns a configured router - this is consumed by mobileApp.tables.add.
*/
var attachRoutes = require('./attachRoutes'),
    executeOperation = require('../middleware/executeOperation'),
    utilities = require('../../utilities'),
    express = require('express');

/**
Creates an instance of a table configuration helper.
@param {tableDefinition} definition Additional table options. These properties can also be specified directly on the helper object itself.
@returns An object with the members described below.
*/
module.exports = function (definition) {
    // create a router here that we will attach routes to using attachRoutes
    // exposing table.execute allows users to mount custom middleware before or after execution
    var router = express.Router(),
        table = utilities.assign({
            router: function (name) {
                table.name = name;
                return attachRoutes(table, router, table.operation);
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
    Middleware must contain the middleware exposed through table.operation. You can also set the authorize property on this member.
    @function read
    @param {module:azure-mobile-apps/express/tables/table~tableOperationHandler} handler - A function containing logic to execute each time a table read is performed.
    @example
var table = require('azure-mobile-apps').table();
table.read.authorize = true;
table.read.use(customMiddleware, table.operation);
table.read(function (context) {
    // add an additional query operator
    context.query.where({ property: 'value' });
    return context.execute();
});
    */
    table.read = attachOperation('read');

    /**
    @callback tableOperationHandler
    @param {context} context The current azure-mobile-apps context object
    */

    /** Identical syntax and semantics to the read function, but for update operations.
    @function update
    @param {module:azure-mobile-apps/express/tables/table~tableOperationHandler} handler - A function containing logic to execute each time a table read is performed.
    */
    table.update = attachOperation('update');

    /** Identical syntax and semantics to the read function, but for insert operations.
    @function insert
    @param {module:azure-mobile-apps/express/tables/table~tableOperationHandler} handler - A function containing logic to execute each time a table insert is performed.
    */
    table.insert = attachOperation('insert');

    /** Identical syntax and semantics to the read function, but for delete operations.
    @function delete
    @param {module:azure-mobile-apps/express/tables/table~tableOperationHandler} handler - A function containing logic to execute each time a table delete is performed.
    */
    table.delete = attachOperation('delete');

    /** Identical syntax and semantics to the read function, but for undelete operations.
    @function undelete
    @param {module:azure-mobile-apps/express/tables/table~tableOperationHandler} handler - A function containing logic to execute each time a table undelete is performed.
    */
    table.undelete = attachOperation('undelete');

    return table;

    // returns a function that populates the table definition object with middleware provided for the operation
    function attachMiddleware(operation) {
        return function (middleware) {
            table.middleware[operation] = table.middleware[operation] || [];
            Array.prototype.push.apply(table.middleware[operation], arguments);
        };
    }

    // returns a function that populates the table definition object with the user operation function. includes a .use function as provided by attachMiddleware
    function attachOperation(operation) {
        var api = function (handler) {
            table.operations[operation] = handler;
        };
        api.use = attachMiddleware(operation);
        return api;
    }
};
