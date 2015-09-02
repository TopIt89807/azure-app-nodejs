// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
@typedef context
@description This object is attached to the express request object as the azureMobile property.
@property {module:queryjs/Query} query The parsed OData query if provided and the parseQuery middleware has been executed
@property {string|number} id The ID associated with the request if provided and the parseQuery middleware has been executed
@property {object} item The item being inserted or updated if provided and the parseItem middleware has been executed
@property {express.Request} req The current express {@link http://expressjs.com/4x/api.html#req request object}
@property {express.Response} res The current express {@link http://expressjs.com/4x/api.html#res response object}
@property {module:azure-mobile-apps/data} data The configured data provider
@property {function} tables A function that accepts a string table name and returns a table access object for the above provider
@property {module:azure-mobile-apps/auth/user} user The authenticated user object if the authenticate middleware has been executed
@property {object} results The results of the executeOperation middleware
*/
