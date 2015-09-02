// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/data
@description Exposes data access operations for tables
*/

/**
Create an instance of the data provider specified in the configuration.
@param {dataConfiguration} configuration - The data provider configuration
@returns A function that accepts either a {@link tableDefinition} or
{@link module:azure-mobile-apps/express/tables/table table object} and returns an
object with the members described below.
*/
module.exports = function (configuration) {
    var provider = (configuration && configuration.data && configuration.data.provider) || 'memory';
    return require('./' + provider)(configuration.data);
}

/**
@function read
@description Execute a query against the table.
@param {module:queryjs/Query} query The query to execute
@returns A promise that yields an array. The first element is the results of the query.
If the includeTotalCount option was set on the query, the second element is the total number of records.
*/
/**
@function update
@description Update a row in the table.
@param {object} item The item to update
@returns A promise that yields an array. The first element is the number of records affected. The second element is the updated object.
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
@param {string|number} id The id of the item to delete
@param {string} version Base64 encoded row version
@returns A promise that yields an array. The first element is the number of records affected. The second element is the deleted object.
*/
/**
@function undelete
@description Undelete an item from the table
@param {string|number} id The id of the item to delete
@param {string} version Base64 encoded row version
@returns A promise that yields an array. The first element is the number of records affected. The second element is the undeleted object.
*/
/**
@function truncate
@description Clear all rows from the table
@returns A promise.
*/
