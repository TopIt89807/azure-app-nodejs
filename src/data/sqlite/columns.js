var execute = require('./execute'),
    statements = require('./statements'),
    convert = require('./convert'),
    helpers = require('./helpers'),
    promises = require('../../utilities/promises'),
    queries = require('../../query'),

    typesTable = { name: '__types' },
    reservedColumns = {
        id: 'string',
        createdAt: 'date',
        updatedAt: 'date',
        version: 'string',
        deleted: 'boolean'
    };

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
        fromItem: function (table, item) {
            item = item || {};
            // add columns from item
            var itemColumns = Object.keys(item).map(function (property) {
                return { name: property, type: helpers.getSchemaType(item[property]) };
            });

            // add predefined columns
            if(table.columns)
                Object.keys(table.columns).forEach(function (predefinedColumn) {
                    itemColumns.push({ name: predefinedColumn, type: table.columns[predefinedColumn]});
                });

            // add reserved properties
            Object.keys(reservedColumns).forEach(function (reservedColumn) {
                if(!item.hasOwnProperty(reservedColumn))
                    itemColumns.push({ name: reservedColumn, type: reservedColumns[reservedColumn] });
            });

            return itemColumns;
        }
    };

    return api;

    function get(table) {
        if(table.sqliteColumns)
            return promises.resolved(table.sqliteColumns);

        var query = queries.create(typesTable.name).select('name', 'type').where({ table: table.name }),
            statement = statements.read(query, typesTable);
        statement.transform = undefined;

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

    function set(table, item) {
        var itemColumns = api.fromItem(table, item),
            setStatements = statements.setColumns(table, itemColumns);
        return execute(configuration, setStatements)
            .catch(function (error) {
                return initialize(table).then(function () {
                    // if we fail this time, we're borked
                    return execute(configuration, setStatements);
                });
            })
            .then(function (columns) {
                table.sqliteColumns = itemColumns;
            });
    }

    function initialize(table) {
        return execute(configuration, statements.createColumnsTable(table));
    }
};
