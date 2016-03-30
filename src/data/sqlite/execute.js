// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var sqlite3 = require('sqlite3'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    errors = require('../../utilities/errors'),
    errorCodes = require('./errorCodes'),
    log = require('../../logger'),
    connection;

module.exports = function (config, statements) {
    connection = connection || new sqlite3.Database(config.filename || ':memory:');

    var results;

    if(statements.constructor === Array)
        return promises.all(statements.map(executeSingleStatement)).then(function () {
            return results;
        });
    else
        return executeSingleStatement(statements);

    function executeSingleStatement(statement) {
        if(statement.noop)
            return promises.resolved();

        var parameters = {};

        // SQLite expects the '@' symbol prefix for each parameter
        if(statement.parameters) {
            if(statement.parameters.constructor === Array)
                statement = {
                    sql: statement.sql,
                    parameters: helpers.mapParameters(statement.parameters)
                };
                
            Object.keys(statement.parameters).forEach(function (parameterName) {
                parameters['@' + parameterName] = statement.parameters[parameterName];
            });
        }

        log.silly('Executing SQL statement ' + statement.sql + ' with parameters ' + JSON.stringify(parameters));

        return promises.create(function (resolve, reject) {
            connection.all(statement.sql, parameters, function (err, rows) {
                if(err) {
                    log.debug('SQL statement failed - ' + err.message + ': ' + statement.sql + ' with parameters ' + JSON.stringify(parameters));

                    // console.dir(err)
                    //
                    // if(err.number === errorCodes.UniqueConstraintViolation)
                    //     reject(errors.duplicate('An item with the same ID already exists'));
                    //
                    // if(err.number === errorCodes.InvalidDataType)
                    //     reject(errors.badRequest('Invalid data type provided'));

                    reject(err);
                }

                var queryResults = statement.transform ? statement.transform(rows) : rows;

                if(queryResults !== undefined)
                    results = queryResults;

                resolve(queryResults);
            });
        });
    }
};
