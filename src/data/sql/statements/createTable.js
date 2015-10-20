// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    utilities = require('../../../utilities'),
    assign = require('deep-assign');

module.exports = function (tableConfig, item) {
    var tableName = helpers.formatTableName(tableConfig.schema || 'dbo', tableConfig.name),

        pkType = tableConfig.autoIncrement ? 'INT' : helpers.getSqlType((item.id === undefined || item.id === null) ? '' : item.id, true),
        pkColumnSql = '[id] ' + pkType + ' NOT NULL' + (tableConfig.autoIncrement ? ' IDENTITY (1, 1)' : '') + ' PRIMARY KEY',

        systemProperties = [
            pkColumnSql,
            'version ROWVERSION NOT NULL',
            'createdAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0)',
            'updatedAt DATETIMEOFFSET(3) NOT NULL DEFAULT CONVERT(DATETIMEOFFSET(3),SYSUTCDATETIME(),0)',
            'deleted bit NOT NULL DEFAULT 0'
        ],
        columns = assign(itemColumnsSql(), predefinedColumnsSql()),
        columnSql = systemProperties.concat(utilities.object.values(columns)).join(',');

    return {
        sql: 'CREATE TABLE ' + tableName + ' (' + columnSql + ') ON [PRIMARY]'
    };

    function itemColumnsSql() {
        return Object.keys(item).reduce(function (sql, property) {
            // if(item[property] === null || item[property] === undefined)
            //     throw new Error('Unable to determine column type for table ' + tableConfig.name + ', property ' + property);

            if(item[property] !== null && item[property] !== undefined && property !== 'id' && !isSystemProperty(property))
                sql[property.toLowerCase()] = '[' + property + '] ' + helpers.getSqlType(item[property]) + ' NULL';

            return sql;
        }, {});
    }

    function isSystemProperty(property) {
        return ['version', 'createdAt', 'updatedAt', 'deleted'].some(function (systemProperty) { return property === systemProperty; });
    }

    function predefinedColumnsSql() {
        if(!tableConfig.columns) return {};
        return Object.keys(tableConfig.columns).reduce(function (sql, columnName) {
            sql[columnName.toLowerCase()] = '[' + columnName + '] ' + helpers.getPredefinedColumnType(tableConfig.columns[columnName]);
            return sql;
        }, {});
    }
};
