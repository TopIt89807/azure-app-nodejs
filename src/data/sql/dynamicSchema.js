// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var statements = require('./statements'),
    execute = require('./execute'),
    promises = require('../../utilities/promises'),
    log = require('../../logger');

var errorCodes = {
    InvalidColumnName: 207,
    InvalidObjectName: 208
}

module.exports = function (config) {
    var api = {
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
                    return createTable();
                if(err.number === errorCodes.InvalidColumnName)
                    return updateSchema();
                return promises.rejected(err);
            }

            function createTable() {
                log.info('Creating table ' + table.name);
                return execute(config, statements.createTable(table, item))
                    .then(function () {
                        return execute(config, statements.createTrigger(table))
                    })
                    .then(function () {
                        if(table.indexes) {
                            if(Array.isArray(table.indexes)) {
                                return createIndexes();
                            } else {
                                throw new Error('Index configuration of table \'' + table.name + '\' should be an array containing either strings or arrays of strings.');
                            }
                        }
                    });
            }

            function createIndexes() {
                log.info('Creating indexes for table ' + table.name);
                return promises.all(
                    table.indexes.map(function (indexConfig) {
                        return execute(config, statements.createIndex(table, indexConfig));
                    })
                );
            }

            function updateSchema() {
                log.info('Updating schema for table ' + table.name);
                return execute(config, statements.getColumns(table)).then(function (columns) {
                    return execute(config, statements.updateSchema(table, columns, item));
                });
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
