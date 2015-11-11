// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var execute = require('./execute'),
    promises = require('../../utilities/promises'),
    schemas = require('./schema');

var errorCodes = {
    InvalidColumnName: 207,
    InvalidObjectName: 208
}

module.exports = function (config) {
    var schema = schemas(config),
        api = {
            execute: function (table, statement, item, attempt) {
                attempt = attempt || 1;

                return execute(config, statement)
                    .catch(function (err) {
                        return handleError(err).then(function () {
                            return api.execute(table, statement, item, attempt + 1);
                        });
                    });

                function handleError(err) {
                    if (attempt >= 3)
                        return promises.rejected(err);

                    if(err.number === errorCodes.InvalidObjectName)
                        return schema.createTable(table, item);
                    if(err.number === errorCodes.InvalidColumnName)
                        return schema.updateSchema(table, item);
                    return promises.rejected(err);
                }

            },
            read: function (table, statement) {
                var dynamic = table.dynamicSchema === undefined || table.dynamicSchema;
                return execute(config, statement)
                    .catch(function (err) {
                        // if dynamic schema is enabled and the error is invalid column, it is likely that the schema has not been
                        // updated to include the column. V1 behavior is to return an empty array, maintain this behavior.
                        if(dynamic && (err.number === errorCodes.InvalidColumnName || err.number === errorCodes.InvalidObjectName)) {
                            var result = [[]];
                            return result;
                        }
                        throw err;
                    });
            }
        };

    return api;
};
