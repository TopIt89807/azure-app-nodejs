// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = {
    apply: function (filter, query, context) {
        return require('./' + filter).filter(query, context) || query;
    },
    applyTransform: function (transform, item, context) {
        return require('./' + transform).transform(item, context) || item;
    }
}