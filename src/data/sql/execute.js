// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var mssql = require('mssql'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    connection;

module.exports = function (config, statement) {
    // for some reason, creating a new connection object for each request hangs on the second request when hosted
    // not sure if this will have any effect on performance, i.e. does each request have to wait for the last to complete?
    if(!connection) {
        connection = new mssql.Connection(config)
        return connection.connect()
            .then(executeRequest)
            .catch(function (err) {
                connection = undefined;
                throw err;
            });
    } else
        return executeRequest();

    function executeRequest() {
        var request = new mssql.Request(connection);

        request.multiple = statement.multiple;

        if(statement.parameters) {
            statement.parameters.forEach(function (parameter) {
                var type = parameter.type || helpers.getMssqlType(parameter.value);
                if(type)
                    request.input(parameter.name, type, parameter.value);
                else
                    request.input(parameter.name, parameter.value);
            });
        }

        return request.query(statement.sql).catch(function (err) {
            if(err.number === 2627) {
                var error = new Error('An item with the same ID already exists');
                error.duplicate = true;
                throw error;
            }
            return promises.rejected(err);
        });
    }
};
