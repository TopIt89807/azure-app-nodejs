// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var apply = require('./hooks'),
    assert = require('../utilities/assert').argument;

module.exports = function (provider, table, context) {
    var tableAccess = provider(table);

    context = context || {};

    // could do with a refactor!
    return {
        read: function (query) {
            var newContext = createContext('read', query);
            return tableAccess.read(apply.filters(table, query, newContext))
                .then(apply.hooks(newContext));
        },
        update: function (item, query) {
            assert(item, 'An item to update was not provided');
            var newContext = createContext('update', query, item);
            return tableAccess.update(apply.transforms(table, item, newContext), apply.filters(table, query, newContext))
                .then(apply.hooks(newContext));
        },
        insert: function (item) {
            assert(item, 'An item to insert was not provided');
            var newContext = createContext('create', null, item);
            return tableAccess.insert(apply.transforms(table, item, newContext))
                .then(apply.hooks(newContext));
        },
        delete: function (query, version) {
            assert(query, 'The delete query was not provided');
            var newContext = createContext('delete', query);
            return tableAccess.delete(apply.filters(table, query, newContext), version)
                .then(apply.hooks(newContext));
        },
        undelete: function (query, version) {
            assert(query, 'The undelete query was not provided');
            var newContext = createContext('undelete', query);
            return tableAccess.undelete(apply.filters(table, query, newContext), version)
                .then(apply.hooks(newContext));
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
        result.table = table;
        return result;
    }
};
