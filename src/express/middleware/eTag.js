// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../query'),
    getEtagFromVersion = require('../../utilities/strings').getEtagFromVersion;

module.exports = {
    singleResult: function (req, res, next) {
        if (res.results && res.results.version) {
            res.set('ETag', getEtagFromVersion(res.results.version));
        }
        next();
    },

    readIdResult: function (req, res, next) {
        if (res.results && res.results.length === 1 && res.results[0].version) {
            res.set('ETag', getEtagFromVersion(res.results[0].version));
        }
        next();
    }
}

