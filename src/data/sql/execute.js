// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var mssql = require('mssql'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    log = require('../../logger');

module.exports = function (config, sql) {
    if(sql.noop)
        return promises.resolved();

     var connection = new mssql.Connection(config)

     return connection.connect()
            .then(executeRequest);
            // .then(function (results) {
            //     close();
            //     return results;
            // });

    // function close() {
    //     connection.close();
    // }

    function executeRequest() {
        var request = new mssql.Request(connection);

        var statements = sql;
        if (sql.constructor !== Array) {
            statements = [sql];
        }

        // We expect multiple results if there are multiple statements to be executed or if
        // 'multiple' results are explicitly requested
        request.multiple = statements.length > 1 ||  statements[0].multiple;

        var statement = '',
            params = [];

        // Combine the statements into a single statement
        statements.forEach(function(st) {
            statement += st.sql + '; ';

            if (st.parameters) {
                params = params.concat(st.parameters)
            }
        });

        // Combine the parameter lists into a single list
        params.forEach(function (parameter) {
            var type = parameter.type || helpers.getMssqlType(parameter.value);
            if(type)
                request.input(parameter.name, type, parameter.value);
            else
                request.input(parameter.name, parameter.value);
        });

        log.verbose('Executing SQL statement ' + statement + ' with parameters ' + JSON.stringify(params));

        return request.query(statement).catch(function (err) {
            log.debug('SQL statement failed - ' + err.message + ': ' + statement + ' with parameters ' + JSON.stringify(params));
            if(err.number === 2627) {
                var error = new Error('An item with the same ID already exists');
                error.duplicate = true;
                throw error;
            }
            return promises.rejected(err);
        });
    }
};
