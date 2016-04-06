var helpers = require('../helpers'),
    reservedColumns = {
        id: 'string',
        createdAt: 'date',
        updatedAt: 'date',
        version: 'string',
        deleted: 'boolean'
    };

module.exports = function (existingColumns, table, item) {
    var columns = [],
        added = {};

    item = item || {};
    table = table || {};
    existingColumns = existingColumns || [];

    // map out columns from item
    var itemColumns = Object.keys(item).map(function (property) {
        return { name: property, type: helpers.getSchemaType(item[property]) };
    });

    addFromObject(reservedColumns);
    addFromArray(existingColumns);
    addFromObject(table.columns);
    addFromArray(itemColumns);

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
}
