// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = function (path) {
    try {
        return require(path);
    } catch(ex) {
        return {};
    }
}
