var helpers = require('../helpers');

module.exports = function (existingColumns, table, item) {
    var columns = [],
        added = {};

    item = item || {};
    table = table || {};
    existingColumns = existingColumns || [];

    // map out columns from item
    var itemColumns = Object.keys(item).map(function (column) {
        return { name: column, type: helpers.getColumnTypeFromValue(item[column]) };
    });

    addFromArray(existingColumns);
    addFromObject(table.columns);
    addFromArray(itemColumns);
    addFromObject(reservedColumns());

    return columns;

    function addFromArray(source) {
        source.forEach(function (column) {
            if(!added[column.name])
                columns.push(column);
            added[column.name] = true;
        });
    }

    function addFromObject(source) {
        if(source)
            Object.keys(source).forEach(function (sourceColumn) {
                if(!added[sourceColumn])
                    columns.push({ name: sourceColumn, type: source[sourceColumn] });
                added[sourceColumn] = true;
            });
    }

    function reservedColumns() {
        return {
            id: table.autoIncrement ? 'number' : 'string',
            createdAt: 'date',
            updatedAt: 'date',
            version: 'string',
            deleted: 'boolean'
        };
    }
}
