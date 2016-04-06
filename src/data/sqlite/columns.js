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
        fromItem: createColumnList
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
        var itemColumns, setStatements;

        return get(table)
            .then(function (existingColumns) {
                itemColumns = createColumnList(item, table, existingColumns);
                setStatements = statements.setColumns(table, itemColumns, existingColumns);
                return execute(configuration, setStatements)
            })
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

    function createColumnList(item, table, existingColumns) {
        var columns = [],
            added = {};

        item = item || {};
        table = table || {};
        existingColumns = existingColumns || [];

        // map out columns from item
        var itemColumns = Object.keys(item).map(function (property) {
            return { name: property, type: helpers.getSchemaType(item[property]) };
        });

        // add existing columns and columns from item
        existingColumns.concat(itemColumns).forEach(function (column) {
            if(!added[column.name])
                columns.push({
                    name: column.name,
                    type: (table.columns && table.columns[column.name]) || column.type
                });
            added[column.name] = true;
        });

        // add predefined columns
        if(table.columns)
            Object.keys(table.columns).forEach(function (predefinedColumn) {
                if(!added[predefinedColumn])
                    columns.push({ name: predefinedColumn, type: table.columns[predefinedColumn]});
            });

        // add reserved properties
        Object.keys(reservedColumns).forEach(function (reservedColumn) {
            if(!added[reservedColumn])
                columns.push({ name: reservedColumn, type: reservedColumns[reservedColumn] });
        });

        return columns;
    }
};
