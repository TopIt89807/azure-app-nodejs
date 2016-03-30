// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (tableConfig) {
    return {
        sql: "PRAGMA table_info(" + helpers.formatTableName(tableConfig.name) + ")"
    }
}
