// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (tableConfig, existingColumns, item) {
    var tableName = helpers.formatTableName(tableConfig.schema || 'dbo', tableConfig.name),
        properties = Object.keys(item).concat(helpers.getSystemProperties()),
        columnSql = properties.reduce(function (sql, property) {
            if(!existingColumns.some(function (col) { return col.name === property })) {
                if (helpers.isSystemProperty(property))
                    sql.push(helpers.getSystemPropertiesDDL()[property]);
                else if (item[property] !== null && item[property] !== undefined)
                    sql.push('[' + property + '] ' + helpers.getSqlType(item[property]) + ' NULL');
                existingColumns.push({ name: property });
            }
            return sql;
        }, []).join(',');

    return {
        sql: "ALTER TABLE " + tableName + " ADD " + columnSql
    };
};
