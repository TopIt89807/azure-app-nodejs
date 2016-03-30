// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    format = require('azure-odata-sql').format,
    queries = require('../../../query'),
    mssql = require('mssql');

module.exports = function (table, query, version) {
    var tableName = helpers.formatTableName(table.name),
        filterClause = format.filter(queries.toOData(query)),
        deleteStmt = {
            sql: "DELETE FROM " + tableName + " WHERE " + filterClause.sql + ';',
            parameters: helpers.statements.mapParameters(filterClause.parameters)
        },
        selectStmt = {
            sql: "SELECT * FROM " + tableName + " WHERE " + filterClause.sql + ";",
            parameters: helpers.statements.mapParameters(filterClause.parameters),
            transform: helpers.statements.prepareItems
        },
        countStmt = {
            sql: "SELECT changes() AS recordsAffected;",
            transform: helpers.statements.checkConcurrency
        };

    if (table.softDelete)
        deleteStmt.sql = "UPDATE " + tableName + " SET [deleted] = 1 WHERE " + filterClause.sql + " AND [deleted] = 0;";

    if (version) {
        deleteStmt.sql += " AND [version] = @version";
        deleteStmt.parameters.version = version;
    }

    // if we are soft deleting, we can select the row back out after deletion and get up to date versions, etc.
    // if not, we have to select the row out before we delete it
    if (table.softDelete)
        return [deleteStmt, selectStmt, countStmt];
    else
        return [selectStmt, deleteStmt, countStmt];
};
