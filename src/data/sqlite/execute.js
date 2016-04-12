// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var transactions = require('./transactions'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    errors = require('../../utilities/errors'),
    errorTypes = require('./errorTypes'),
    log = require('../../logger'),
    connections = require('./connections');

module.exports = function (config, statements, transaction) {
    var connection = connections.obtain(config);

    if(statements.constructor === Array)
        return transactions(config, connection, statements);
    else
        return executeSingleStatement(statements);

    function executeSingleStatement(statement) {
        if(statement.noop)
            return promises.resolved();

        var parameters = {};

        if(statement.parameters) {
            // support being passed mssql style parameters
            if(statement.parameters.constructor === Array)
                statement = {
                    sql: statement.sql,
                    parameters: helpers.mapParameters(statement.parameters),
                    transform: statement.transform
                };

            // SQLite expects the '@' symbol prefix for each parameter
            Object.keys(statement.parameters).forEach(function (parameterName) {
                parameters['@' + parameterName] = statement.parameters[parameterName];
            });
        }

        log.silly('Executing SQL statement ' + statement.sql + ' with parameters ' + JSON.stringify(parameters));

        return promises.create(function (resolve, reject) {
            (transaction || connection).all(statement.sql, parameters, function (err, rows) {
                try {
                    if(err) {
                        log.debug('SQL statement failed - ' + err.message + ': ' + statement.sql + ' with parameters ' + JSON.stringify(parameters));

                        if(errorTypes.isUniqueViolation(err))
                            error(errors.duplicate('An item with the same ID already exists'));

                        else if(errorTypes.isInvalidDataType(err))
                            error(errors.badRequest('Invalid data type provided'));

                        else
                            error(err);
                    } else {
                        success(statement.transform ? statement.transform(rows) : rows);
                    }
                } catch(err) {
                    error(err);
                }
            });
            
            function success(results) {
                connections.release(connection);
                resolve(results);
            }
            
            function error(err) {
                connections.release(connection);
                reject(err);
            }
        });
    }
};
