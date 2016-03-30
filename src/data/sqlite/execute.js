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

module.exports = function (config, statement) {
    var parameters = {};

    connection = connection || new sqlite3.Database(config.filename || ':memory:');

    if(statement.noop)
        return promises.resolved();

    if(statement.parameters)
        statement.parameters.forEach(function (parameter) {
            parameters[parameter.name] = parameter.value;
        });

    log.silly('Executing SQL statement ' + statement.sql + ' with parameters ' + JSON.stringify(statement.parameters));

    return promises.create(function (resolve, reject) {
        connection.all(statement.sql, parameters, function (err, results) {
            if(err) {
                log.debug('SQL statement failed - ' + err.message + ': ' + statement.sql + ' with parameters ' + JSON.stringify(statement.parameters));

                if(err.number === errorCodes.UniqueConstraintViolation)
                    reject(errors.duplicate('An item with the same ID already exists'));

                if(err.number === errorCodes.InvalidDataType)
                    reject(errors.badRequest('Invalid data type provided'));

                reject(err);
            }

            resolve(statement.transform ? statement.transform(results) : results);
        });
    });
};
