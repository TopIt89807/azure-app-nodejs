// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var filters = require('./filters'),
    assert = require('../utilities/assert').argument,
    queries = require('../query');

module.exports = function (provider, table, context) {
    var tableAccess = provider(table);

    context = context || {};

    return {
        read: function (query) {
            return tableAccess.read(applyFilters(query, 'read'));
        },
        update: function (item, query) {
            assert(item, 'An item to update was not provided');
            return tableAccess.update(applyTransforms(item, 'update'), applyFilters(query, 'update'));
        },
        insert: function (item) {
            assert(item, 'An item to insert was not provided');
            return tableAccess.insert(applyTransforms(item, 'create'));
        },
        delete: function (query, version) {
            assert(query, 'The delete query was not provided');
            return tableAccess.delete(applyFilters(query, 'delete'), version);
        },
        undelete: function (query, version) {
            assert(query, 'The undelete query was not provided');
            return tableAccess.undelete(applyFilters(query, 'undelete'), version);
        },
        truncate: tableAccess.truncate,
        initialize: tableAccess.initialize,
        schema: tableAccess.schema
    };

    // below should be refactored out into filters/index.js
    function applyFilters(query, operation) {
        var context = createContext(operation);

        if(table.perUser) query = filters.apply.filter('perUser', query, context);
        if(table.recordsExpire) query = filters.apply.filter('recordsExpire', query, context);
        if(table.webhook) query = filters.apply.filter('webhook', query, context);

        if(!table.filters) return query;

        return table.filters.reduce(function (query, filter) {
            // this is a bit of trickery to allow filters to either 
            // modify the existing query or return a different query
            // see the test in data/integration/filters for an example                
            return filter(query, context) || query;
        }, query || queries.create(table.name));
    }

    function applyTransforms(item, operation) {
        var context = createContext(operation);

        if(table.perUser) item = filters.apply.transform('perUser', item, context);
        if(table.webhook) item = filters.apply.transform('webhook', item, context);

        if(!table.transforms) return item;

        return table.transforms.reduce(function (item, transform) {
            return transform(item, context) || item;
        }, item);
    }

    function createContext(operation) {
        // shallow clone the context operation and assign the correct operation
        var result = Object.keys(context).reduce(function (target, key) {
            target[key] = context[key];
            return target;
        }, {});
        result.operation = operation;
        return result;
    }
};