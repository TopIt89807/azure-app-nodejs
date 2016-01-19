// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var merge = require('deeply');

module.exports = function (configuration, source) {
    return merge(configuration, source);
};
