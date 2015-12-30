// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var mssql = require('mssql'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    log = require('../../logger'),
    connection, connectionPromise;

module.exports = function (config, statement) {
    if(statement.noop)
        return promises.resolved();

    if (!connectionPromise) {
        connection = new mssql.Connection(config);
        connectionPromise = connection.connect()
            .catch(function (err) {
                connectionPromise = undefined;
                throw err;
            });
    }

    return connectionPromise.then(executeRequest);

    function executeRequest() {
        var request = new mssql.Request(connection);

        request.multiple = statement.multiple;

        statement.parameters && statement.parameters.forEach(function (parameter) {
            var type = parameter.type || helpers.getMssqlType(parameter.value);
            if(type)
                request.input(parameter.name, type, parameter.value);
            else
                request.input(parameter.name, parameter.value);
        });

        log.silly('Executing SQL statement ' + statement.sql + ' with parameters ' + JSON.stringify(statement.parameters));

        return request.query(statement.sql).catch(function (err) {
            log.debug('SQL statement failed - ' + err.message + ': ' + statement.sql + ' with parameters ' + JSON.stringify(statement.parameters));

            if(err.number === 2627) {
                var error = new Error('An item with the same ID already exists');
                error.duplicate = true;
                throw error;
            }

            if(err.number === 245) {
                var error = new Error('Invalid data type provided');
                error.badRequest = true;
                throw error
            }

            return promises.rejected(err);
        });
    }
};
