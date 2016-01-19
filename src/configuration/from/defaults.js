// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var defaults = require('../defaults'),
    merge = require('deeply');

module.exports = function (configuration, overrides) {
    return merge(configuration || {}, defaults(), overrides);
};
