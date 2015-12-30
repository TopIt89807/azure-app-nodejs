// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    format = require('../query/format'),
    queries = require('../../../query');

module.exports = function (table, query) {
    var tableName = helpers.formatTableName(table.schema || 'dbo', table.name),
        filterClause = format.filter(queries.toOData(query)),
        deleteStmt = "DELETE FROM " + tableName + " WHERE " + filterClause.sql + ";",
        selectStmt = "SELECT * FROM " + tableName + " WHERE " + filterClause.sql + ";";

    if (table.softDelete) {
        deleteStmt = "UPDATE TOP (1) " + tableName + " SET [deleted] = 1 WHERE " + filterClause.sql + " AND [deleted] = 0;";
    }

    deleteStmt += "SELECT @@rowcount AS recordsAffected;";

    if (table.softDelete) {
        // if soft delete, select after delete
        deleteStmt += selectStmt;
    } else {
        // if not soft delete, select before delete
        deleteStmt = selectStmt + deleteStmt;
    }

    function transformResults(results) {
        // non-soft delete returns results in opposite order due to select -> delete ordering
        if(!table.softDelete && results && results.length === 2)
            results = [results[1], results[0]];

        return helpers.statements.checkConcurrencyAndTranslate(results);
    }

    return {
        sql: deleteStmt,
        parameters: filterClause.parameters,
        multiple: true,
        transform: transformResults
    };
};
