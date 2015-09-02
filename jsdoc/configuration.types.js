// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
/**
The top level configuration object.
@typedef configuration
@property {string} platform=express - Server platform to use. Currently only express is supported,
@property {string} basePath=. - Base path to use for the application,
@property {string} configFile=azureMobile.js - Name of the file that exports configuration objects to load,
@property {Promise} promiseConstructor Promise constructor to use,
@property {string} tableRootPath=/tables - Directory to load table configuration from,
@property {bool} debug=false - Run the server in debug mode. Automatically turned on when node is executed with the --debug option,
@property {string} version - Current version of the Azure Mobile Apps SDK,
@property {loggingConfiguration} logging - Logging configuration
@property {dataConfiguration} data - Data configuration
@property {authConfiguration} auth - Authentication configuration
@property {corsConfiguration} cors - Cross-origin resource sharing configuration
*/

/**
Logging configuration
@typedef loggingConfiguration
@property {string} level=info - Minimum level of messages to log
@property {Object} transports=Console - Hash of winston transports to log messages to
@see {@link https://github.com/winstonjs/winston}
*/

/**
Data configuration. See {@link sqlServerDataConfiguration} for details on configuring SQL Server
@typedef dataConfiguration
@property {string} provider=memory - Data provider to use. Supported providers are sql and memory
*/

/**
SQL Server data configuration
@typedef sqlServerDataConfiguration
@property {string} user - User name to connect with
@property {string} password - Password for user
@property {string} server - Hostname of the database server
@property {integer} port=1433 - Port to connect to
@property {string} database - Name of the database to connect to
@property {integer} connectionTimeout=15000 - Connection timeout in milliseconds
@property {Object} options - Additional options
@property {bool} options.encrypt - Encrypt the connection. Required and turned on automatically for SQL Azure
@see {@link https://www.npmjs.com/package/mssql}
*/

/**
Authentication configuration
@typedef authConfiguration
@property {string} secret - Key to use to sign and validate JWT tokens
@property {string} audience=urn:microsoft:windows-azure:zumo - Token audience claim
@property {string} issuer=urn:microsoft:windows-azure:zumo - Token issuer claim
@property {integer} expiresInMinutes=1440 - Expiry of signed tokens
@see {@link http://jwt.io/}
@see {@link https://github.com/auth0/node-jsonwebtoken}
*/

/**
Cross-origin resource sharing configuration
@typedef corsConfiguration
@property {integer} maxAge=300 - How long the results of a preflight request can be cached in a preflight result cache,
@property {string[]} origins=localhost - Array of allowed origins
*/
