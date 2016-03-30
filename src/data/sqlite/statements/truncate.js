// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers');

module.exports = function (table) {
    return {
        sql: 'DELETE FROM ' + helpers.formatTableName(table.name)
    }
}
