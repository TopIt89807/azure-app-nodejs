// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var table = require('azure-mobile-apps').table();

table.columns = {
    "installationId": "string",
    "tag": "string"
};

table.insert(function (context) {
    // we can perform validation here, e.g. that the user is allowed to register for the tag
    // we could also combine authentication here and store per-user tags instead of per-installation
    context.item.installationId = context.req.get('X-ZUMO-INSTALLATION-ID');
    return context.execute();
});

module.exports = table;
