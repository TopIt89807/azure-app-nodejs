// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var combine = require('./combine'),
    execute = require('../execute'),
    statements = require('../statements'),
    convert = require('../convert'),
    promises = require('../../../utilities/promises');

module.exports = function (configuration) {
    configuration = configuration || {};

    var api = {
        for: get,
        set: set,
        applyTo: function (table, items) {
            return get(table).then(function (columns) {
                return items.map(function (item) {
                    return convert.item(columns, item);
                })
            })
        },
        discover: function (table, item) {
            return get(table).then(function (existingColumns) {
                return combine(existingColumns, table, item);
            });
        }
    };
    return api;

    function get(table) {
        if(table.sqliteColumns)
            return promises.resolved(table.sqliteColumns);

        var statement = { sql: "SELECT [name], [type] FROM [__types] WHERE [table] = @table", parameters: { table: table.name } };

        return execute(configuration, statement)
            .then(function (columns) {
                table.sqliteColumns = columns;
                return columns;
            })
            .catch(function (error) {
                // nothing has been inserted for this table, we're going to return an empty array of results later anyway
                return [];
            });
    }

    function set(table, columns) {
        var setStatements = statements.columns.set(table, columns);
        return execute(configuration, setStatements)
            .catch(function (error) {
                return initialize(table).then(function () {
                    // if we fail this time, we're borked
                    return execute(configuration, setStatements);
                });
            })
            .then(function () {
                table.sqliteColumns = columns;
            });
    }

    function initialize(table) {
        return execute(configuration, statements.columns.createTable(table));
    }
};
