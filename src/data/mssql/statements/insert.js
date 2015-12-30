// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    errors = require('../../../utilities/errors'),
    _ = require('underscore.string');

module.exports = function (table, item) {
    var tableName = helpers.formatTableName(table.schema || 'dbo', table.name),
        columnNames = [],
        valueParams = [],
        parameters = [];

    Object.keys(item).forEach(function (prop) {
        if (helpers.isSystemProperty(prop))
            throw errors.badRequest('Cannot insert item with property ' + prop + ' as it is reserved');

        // ignore the property if it is an autoIncrement id
        if ((prop !== 'id' || !table.autoIncrement) && item[prop] !== undefined) {
            columnNames.push(helpers.formatMember(prop));
            valueParams.push('@' + prop);
            parameters.push({ name: prop, value: item[prop], type: helpers.getMssqlType(item[prop], prop === 'id') });
        }
    });

    var sql = columnNames.length > 0
        ? _.sprintf("INSERT INTO %s (%s) VALUES (%s); ", tableName, columnNames.join(','), valueParams.join(','))
        : _.sprintf("INSERT INTO %s DEFAULT VALUES; ", tableName)

    if(table.autoIncrement)
        sql += _.sprintf('SELECT * FROM %s WHERE [id] = SCOPE_IDENTITY()', tableName);
    else
        sql += _.sprintf('SELECT * FROM %s WHERE [id] = @id', tableName);

    function transformResult(results) {
        return helpers.statements.translateVersion(results[0]);
    }

    return {
        sql: sql,
        parameters: parameters,
        transform: transformResult
    };
}
