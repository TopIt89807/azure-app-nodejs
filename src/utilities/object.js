// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = {
    values: function (source) {
        return Object.keys(source).map(function (property) {
            return source[property];
        });
    }
}
