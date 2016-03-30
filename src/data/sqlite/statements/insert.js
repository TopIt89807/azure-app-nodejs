// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    _ = require('underscore.string');

module.exports = function (table, item) {
    var tableName = helpers.formatTableName(table.name),
        columnNames = [],
        valueParams = [],
        parameters = {};

    Object.keys(item).forEach(function (property) {
        // ignore the property if it is an autoIncrement id
        if ((property !== 'id' || !table.autoIncrement) && item[property] !== undefined) {
            columnNames.push(helpers.formatMember(property));
            valueParams.push('@' + property);
            parameters[property] = item[property];
        }
    });

    var sql = columnNames.length > 0
        ? _.sprintf("INSERT INTO %s (%s) VALUES (%s);", tableName, columnNames.join(','), valueParams.join(','))
        : _.sprintf("INSERT INTO %s DEFAULT VALUES;", tableName)


    function transformResult(results) {
        return helpers.statements.translateVersion(results[0]);
    }

    return [{
        sql: sql,
        parameters: parameters,
        transform: transformResult
    }, {
        sql: _.sprintf("SELECT * FROM %s WHERE [rowid] = last_insert_rowid();", tableName)
    }];
}
