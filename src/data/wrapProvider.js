// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var assert = require('../utilities/assert').argument,
    queries = require('../query');

module.exports = function (provider, table, context) {
    var tableAccess = provider(table);

    context = context || {};

    return {
        read: function (query) {
            return tableAccess.read(applyFilters(query));
        },
        update: function (item, query) {
            assert(item, 'An item to update was not provided');
            return tableAccess.update(applyTransforms(item), applyFilters(query));
        },
        insert: function (item) {
            assert(item, 'An item to insert was not provided');
            return tableAccess.insert(applyTransforms(item));
        },
        delete: function (query, version) {
            assert(query, 'The delete query was not provided');
            return tableAccess.delete(applyFilters(query), version);
        },
        undelete: function (query, version) {
            assert(query, 'The undelete query was not provided');
            return tableAccess.undelete(applyFilters(query), version);
        },
        truncate: tableAccess.truncate,
        initialize: tableAccess.initialize,
        schema: tableAccess.schema
    };

    function applyFilters(query) {
        if(!table.filters)
            return query;

        return table.filters.reduce(function (query, filter) {
            // this is a bit of trickery to allow filters to either 
            // modify the existing query or return a different query
            return filter(query, context) || query;
        }, query || queries.create(table.name));
    }

    function applyTransforms(item) {
        if(!table.transforms)
            return item;

        return table.transforms.reduce(function (item, transform) {
            // same trick as in filters
            // see the test in data/integration/filters for an example                
            return transform(item, context) || item;
        }, item);
    }
};