// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../query');

var hooks = module.exports = {
    apply: {
        // the query and item functions can probably be removed from all these functions - pick it up from the context
        filter: function (filter, query, context) {
            return require('./' + filter).filter(query, context) || query;
        },
        transform: function (transform, item, context) {
            return require('./' + transform).transform(item, context) || item;
        },
        hook: function (hook, context) {
            return require('./' + hook).hook(context);
        },
        table: {
            filters: function (table, query, context) {
                if(table.perUser) query = hooks.apply.filter('perUser', query, context);
                if(table.recordsExpire) query = hooks.apply.filter('recordsExpire', query, context);

                if(!table.filters) return query;

                return table.filters.reduce(function (query, filter) {
                    // this is a bit of trickery to allow filters to either 
                    // modify the existing query or return a different query
                    // see the test in data/integration/filters for an example                
                    return filter(query, context) || query;
                }, query || queries.create(table.name));
            },
            transforms: function (table, item, context) {
                if(table.perUser) item = hooks.apply.transform('perUser', item, context);

                if(!table.transforms) return item;

                return table.transforms.reduce(function (item, transform) {
                    return transform(item, context) || item;
                }, item);
            },
            hooks: function (context) {
                // hooks are post operation and will always be called directly from a promise's .then callback - wrap in a function
                // currently, hooks are only fire and forget - no returning of modified results is supported
                var table = context.table;

                return function (results) {
                    if(table && table.webhook) hooks.apply.hook('webhook', context);

                    if(table && table.hooks) table.hooks.forEach(function (hook) {
                        hook(results, context);
                    });

                    return results;
                };
            }
        }
    }
};

