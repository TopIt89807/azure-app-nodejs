// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (table, id, version) {
    var tableName = helpers.formatTableName(table.schema || 'dbo', table.name),
        deleteStmt = "DELETE FROM " + tableName + " WHERE [id] = @id",
        parameters = [{ name: 'id', value: id }];

    if (table.softDelete) {
        deleteStmt = "UPDATE TOP (1) " + tableName + " SET [deleted] = 1 WHERE [id] = @id AND [deleted] = 0";
    }

    if (version) {
        deleteStmt += " AND [version] = @version ";
        parameters.push({ name: 'version', value: new Buffer(version, 'base64') });
    }

    deleteStmt += "; SELECT @@rowcount AS recordsAffected; SELECT * FROM " + tableName + " WHERE [id] = @id";

    return {
        sql: deleteStmt,
        parameters: parameters,
        multiple: true
    };
};
