// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var hooks = require('./hooks'),
    assert = require('../utilities/assert').argument;

module.exports = function (provider, table, context) {
    var tableAccess = provider(table);

    context = context || {};

    return {
        read: function (query) {
            return tableAccess.read(hooks.apply.table.filters(table, query, createContext('read', query)));
        },
        update: function (item, query) {
            assert(item, 'An item to update was not provided');
            var context = createContext('update', query, item);
            return tableAccess.update(hooks.apply.table.transforms(table, item, context), hooks.apply.table.filters(table, query, context));
        },
        insert: function (item) {
            assert(item, 'An item to insert was not provided');
            return tableAccess.insert(hooks.apply.table.transforms(table, item, createContext('create', null, item)));
        },
        delete: function (query, version) {
            assert(query, 'The delete query was not provided');
            return tableAccess.delete(hooks.apply.table.filters(table, query, createContext('delete', query)), version);
        },
        undelete: function (query, version) {
            assert(query, 'The undelete query was not provided');
            return tableAccess.undelete(hooks.apply.table.filters(table, query, createContext('undelete', query)), version);
        },
        truncate: tableAccess.truncate,
        initialize: tableAccess.initialize,
        schema: tableAccess.schema
    };

    function createContext(operation, query, item) {
        // context will contain properties set by middleware - we may have been called from a server side script
        // which could make these properties incorrect. shallow clone the context operation and assign the 
        // correct properties for this specific operation
        var result = Object.keys(context).reduce(function (target, key) {
            target[key] = context[key];
            return target;
        }, {});
        result.operation = operation;
        result.query = query || result.query;
        result.item = item || result.item;
        return result;
    }
};
