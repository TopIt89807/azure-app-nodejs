// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

/*
** Sample Table Definition - this supports the Azure Mobile Apps
** TodoItem product
*/
var azureMobileApps = require('azure-mobile-apps'),
    validateApiKey = require('../validateApiKey');

// Create a new table definition
var table = azureMobileApps.table();

// Access should be anonymous.  Users will still be authenticated,
// but unauthenticated users will not be rejected before our custom validateApiKey middleware runs.
table.access = 'anonymous';

// validate api key header prior to table operation execution
table.use(validateApiKey, table.execute);

module.exports = table;