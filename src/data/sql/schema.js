// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var statements = require('./statements'),
    execute = require('./execute'),
    promises = require('../../utilities/promises'),
    log = require('../../logger'),
    data = require('./index');

module.exports = function (config) {
    var api = {
        initialize: function (table) {
            return api.createTable(table)
                .catch(function () {
                    return api.updateSchema(table);
                });
        },

        createTable: function(table, item) {
            log.info('Creating table ' + table.name);
            return execute(config, statements.createTable(table, item))
                .then(function () {
                    return execute(config, statements.createTrigger(table));
                })
                .then(function () {
                    return api.createIndexes(table);
                })
                .then(function () {
                    return api.seedData(table);
                });
        },

        updateSchema: function(table, item) {
            log.info('Updating schema for table ' + table.name);
            return execute(config, statements.getColumns(table))
                .then(function (columns) {
                    return execute(config, statements.updateSchema(table, columns, item));
                })
                .then(function () {
                    return api.createIndexes(table);
                });
        },

        createIndexes: function(table) {
            if(table.indexes) {
                if(Array.isArray(table.indexes)) {
                    log.info('Creating indexes for table ' + table.name);
                    return promises.all(
                        table.indexes.map(function (indexConfig) {
                            return execute(config, statements.createIndex(table, indexConfig));
                        })
                    );
                } else {
                    throw new Error('Index configuration of table \'' + table.name + '\' should be an array containing either strings or arrays of strings.');
                }
            } else {
                return promises.resolved();
            }
        },

        seedData: function (table) {
            if(table.seed) {
                var insert = data(config)(table).insert;
                return promises.all(table.seed.map(insert));
            }
            return promises.resolved();
        }
    };
    return api;
}
