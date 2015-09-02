// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var promises = require('../../../src/utilities/promises');

module.exports = function (data) {
    return function (table) {
        return {
            read: function () {
                return promises.resolved(data);
            },
            update: function (item) {
                return promises.resolved(item);
            },
            insert: function (item) {
                return promises.resolved(item);
            },
            delete: function (id, version) {
                return promises.resolved(id);
            }
        };
    };
};
