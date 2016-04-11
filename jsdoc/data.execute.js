// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@module azure-mobile-apps/data/execute
@description Provides an API for defining queries against arbitrary data sources.
This function is attached to the data object and can be accessed through
req.azureMobile.data.execute
*/

/**
Execute a SQL query directly against the data source
@param {sqlQuery} statement A SQL query object, or array of query objects
@returns A promise that yields the results of the query.
*/
function execute(statement) {}

/**
@typedef sqlQuery
@description An object that encapsulates a SQL query and parameters
@property {string} sql The SQL query to execute
@property {sqlParameter[]} parameters An array of parameters to pass to the query
@property {boolean} multiple Indicates that the query contains more than one individual query. The result set will be an array of arrays.
*/

/**
@typedef sqlParameter
@description Describes a parameter to be passed to a database along with a SQL query
@property {string} name The name of the parameter
@property {string} type An optional type name, either 'string', 'number', 'boolean' or 'date'
@property {object} value The value of the parameter
*/
