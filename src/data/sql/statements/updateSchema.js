// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (tableConfig, existingColumns, item) {
    var tableName = helpers.formatTableName(tableConfig.schema || 'dbo', tableConfig.name),
        properties = Object.keys(item),
        columnSql = properties.reduce(function (sql, property) {
            if(!existingColumns.some(function (col) { return col.name === property })) {
                if(item[property] !== null && item[property] !== undefined)
                    sql.push('[' + property + '] ' + helpers.getSqlType(item[property]) + ' NULL');
            }
            return sql;
        }, []).join(',');

    return {
        sql: "ALTER TABLE " + tableName + " ADD " + columnSql
    };
};
