// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var merge = require('deeply');

module.exports = function (configuration, path) {
    try {
        return merge(configuration, require(path));
    } catch(ex) {
        return configuration;
    }
}
