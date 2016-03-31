var execute = require('./execute'),
    statements = require('./statements'),
    convert = require('./convert'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    queries = require('../../query'),

    typesTable = { name: '__types' };

module.exports = function (configuration) {
    configuration = configuration || {};

    return {
        for: get,
        set: set,
        applyTo: function (table, items) {
            return get(table).then(function (columns) {
                return items.map(function (item) {
                    return convert.item(columns, item);
                })
            })
        },
        fromItem: function (item) {
            return Object.keys(item).map(function (property) {
                return { name: property, type: helpers.getSchemaType(item[property]) };
            });
        }
    };

    function get(table) {
        if(table.sqliteColumns)
            return promises.resolved(table.sqliteColumns);

        var query = queries.create(typesTable.name).select('name', 'type').where({ table: table.name });
        return execute(configuration, statements.read(query, typesTable))
            .then(function (columns) {
                table.sqliteColumns = columns;
                return columns;
            })
            .catch(function (error) {
                // nothing has been inserted for this table, we're going to return an empty array of results later anyway
                return [];
            });
    }

    function set(table, item) {
        var setStatements = statements.setColumns(table, item);
        return execute(configuration, setStatements)
            .catch(function (error) {
                return initialize(table).then(function () {
                    // if we fail this time, we're borked
                    return execute(configuration, setStatements);
                });
            })
            .then(function (columns) {
                table.sqliteColumns = columns;
            });
    }

    function initialize(table) {
        return execute(configuration, statements.createColumnsTable(table));
    }
};
