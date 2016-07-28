// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/src/data
@description Exposes data access operations for tables
*/

var types = require('../utilities/types'),
    assert = require('../utilities/assert').argument,
    queries = require('../query');

/**
Create an instance of the data provider specified in the configuration.
@param {dataConfiguration} configuration - The data provider configuration
@returns A function that accepts either a {@link tableDefinition} or
{@link module:azure-mobile-apps/src/express/tables/table table object} and returns an
object with the members described below. The function also has an
{@link module:azure-mobile-apps/src/data/execute execute} function attached that can
be used to execute raw SQL queries.
*/
module.exports = function (configuration) {
    var provider = createProvider();

    var api = function (table, context) {
        assert(table, 'A table was not specified');
        return wrapTableAccess(provider, table, context);
    };

    api.execute = function (statement) {
        assert(statement, 'A SQL statement was not provided');
        return provider.execute(statement);
    };

    return api;

    function createProvider() {
        var provider = (configuration && configuration.data && configuration.data.provider) || 'memory';
        return (types.isFunction(provider) ? provider : require('./' + provider))(configuration.data);
    }

    function wrapTableAccess(provider, table, context) {
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
            truncate: function () {
                return tableAccess.truncate();
            },
            initialize: function () {
                return tableAccess.initialize();
            },
            schema: function () {
                return tableAccess.schema();
            }
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
    }
};

/**
@function read
@description Execute a query against the table.
@param {module:queryjs/Query} query The query to execute
@returns A promise that yields the results of the query, as expected by the Mobile Apps client.
If the query has a single property specified, the result should be a single object.
If the query has a includeTotalCount property specified, the result should be an object
containing a results property and a count property. 
*/
/**
@function update
@description Update a row in the table.
@param {object} item The item to update
@param {module:queryjs/Query} query An optional query to filter updates
@returns A promise that yields the updated object
*/
/**
@function insert
@description Insert a row in the table.
@param {object} item The item to insert
@returns A promise that yields the inserted object.
*/
/**
@function delete
@description Delete an item from the table
@param {module:queryjs/Query} query A query for a record to delete
@param {string} version Base64 encoded row version
@returns A promise that yields the deleted object
*/
/**
@function undelete
@description Undelete an item from the table
@param {module:queryjs/Query} query A query for a record to undelete
@param {string} version Base64 encoded row version
@returns A promise that yields the undeleted object
*/
/**
@function truncate
@description Clear all rows from the table
@returns A promise.
*/
/**
@function initialize
@description Create or update the underlying database table with the columns specified in the table configuration.
@returns A promise that resolves when the table schema has been created or updated.
*/
/**
@function schema
@description Return the underlying schema for the table
@returns A promise that yields an object that contains the table schema (currently only columns).
*/
