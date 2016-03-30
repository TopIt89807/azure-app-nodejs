// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (tableConfig) {
    var tableName = helpers.formatTableName(tableConfig.name);
    return {
        sql: 'CREATE TRIGGER [TR_' + tableName + '] UPDATE ON ' + tableName + ' BEGIN UPDATE ' + tableName + ' SET [updatedAt] = CURRENT_TIMESTAMP WHERE ' + tableName'.[id] = NEW.[id] END;'
    }
}
