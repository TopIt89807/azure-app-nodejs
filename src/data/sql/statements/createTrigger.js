// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (tableConfig) {
    var tableName = helpers.formatTableName(tableConfig.schema || 'dbo', tableConfig.name);
    return {
        sql: 'CREATE TRIGGER [TR_' + tableConfig.name + '_InsertUpdateDelete] ON ' + tableName + ' AFTER INSERT, UPDATE, DELETE AS BEGIN SET NOCOUNT ON; IF TRIGGER_NESTLEVEL() > 3 RETURN; UPDATE ' + tableName + ' SET [__updatedAt] = CONVERT (DATETIMEOFFSET(3), SYSUTCDATETIME()) FROM INSERTED WHERE INSERTED.id = ' + tableName + '.[id] END'
    }
}
