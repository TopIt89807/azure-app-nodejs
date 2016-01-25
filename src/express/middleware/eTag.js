// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var getEtagFromVersion = require('../../utilities/strings').getEtagFromVersion;

module.exports = function (req, res, next) {
    var result = res.results && (res.results.constructor === Array && res.results[0]) || res.results;
    if (result && result.version) {
        res.set('ETag', getEtagFromVersion(result.version));
    }
    next();
};
