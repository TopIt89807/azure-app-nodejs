// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var queries = require('../../query');
var filters = module.exports = {
    apply: {
        filter: function (filter, query, context) {
            return require('./' + filter).filter(query, context) || query;
        },
        transform: function (transform, item, context) {
            return require('./' + transform).transform(item, context) || item;
        },
        table: {
            filters: function (table, query, context) {
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
            },
            transforms: function (table, item, context) {
                if(table.perUser) item = filters.apply.transform('perUser', item, context);
                if(table.webhook) item = filters.apply.transform('webhook', item, context);

                if(!table.transforms) return item;

                return table.transforms.reduce(function (item, transform) {
                    return transform(item, context) || item;
                }, item);
            }
        }
    }
};

