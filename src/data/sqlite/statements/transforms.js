// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var errors = require('../../../utilities/errors');

module.exports = {
    prepareItems: function (rows) {
        if (rows.length === 0)
            return undefined;
        else if (rows.length === 1)
            return rows[0];
        else
            return rows;
    },
    checkConcurrency: function (rows) {
        if(rows[0].recordsAffected === 0)
            throw errors.concurrency('No records were updated');
    },
    ignoreResults: function () {}
}
