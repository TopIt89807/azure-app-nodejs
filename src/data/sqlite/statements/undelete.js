// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    format = require('azure-odata-sql').format,
    queries = require('../../../query');

module.exports = function (table, query, version) {
    var tableName = helpers.formatTableName(table.name),
        filterClause = format.filter(queries.toOData(query)),
        undeleteStatement = {
            sql: "UPDATE " + tableName + " SET deleted = 0 WHERE " + filterClause.sql,
            parameters: helpers.statements.mapParameters(filterClause.parameters)
        },
        countStatement = {
            sql: "SELECT changes() AS recordsAffected",
            transform: helpers.statements.checkConcurrency
        },
        selectStatement = {
            sql: "SELECT * FROM " + tableName + " WHERE " + filterClause.sql,
            parameters: helpers.statements.mapParameters(filterClause.parameters),
            transform: helpers.statements.prepareItems
        };

    if (version) {
        undeleteStatement.sql += " AND [version] = @version";
        undeleteStatement.parameters.version = version;
    }

    return [undeleteStatement, countStatement, selectStatement];
};
