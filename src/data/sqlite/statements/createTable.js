// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    utilities = require('../../../utilities'),
    assign = require('deeply');

module.exports = function (tableConfig, item) {
    var tableName = helpers.formatTableName(tableConfig.name),

        pkType = tableConfig.autoIncrement ? 'INTEGER' : helpers.getSqlType((!item || item.id === undefined || item.id === null) ? '' : item.id, true),
        pkColumnSql = '[id] ' + pkType + ' PRIMARY KEY',

        systemProperties = [pkColumnSql].concat(utilities.object.values(helpers.getSystemPropertiesDDL())),
        columns = assign(itemColumnsSql(), predefinedColumnsSql()),
        columnSql = systemProperties.concat(utilities.object.values(columns)).join(',');

    return {
        sql: 'CREATE TABLE ' + tableName + ' (' + columnSql + ')'
    };

    function itemColumnsSql() {
        if(!item)
            return {};

        return Object.keys(item).reduce(function (sql, property) {
            if(item[property] !== null && item[property] !== undefined && property !== 'id' && !helpers.isSystemProperty(property))
                sql[property.toLowerCase()] = '[' + property + '] ' + helpers.getSqlType(item[property]) + ' NULL';

            return sql;
        }, {});
    }

    function predefinedColumnsSql() {
        if(!tableConfig.columns) return {};
        return Object.keys(tableConfig.columns).reduce(function (sql, columnName) {
            sql[columnName.toLowerCase()] = '[' + columnName + '] ' + helpers.getPredefinedColumnType(tableConfig.columns[columnName]);
            return sql;
        }, {});
    }
};
