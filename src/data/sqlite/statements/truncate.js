// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (table) {
    return {
        sql: 'TRUNCATE TABLE ' + helpers.formatTableName(table.name)
    }
}
