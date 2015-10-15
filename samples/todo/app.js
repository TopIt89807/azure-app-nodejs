// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var app = require('express')(),
  mobileApp = require('azure-mobile-apps')();

mobileApp.tables.import('./tables');
app.use(mobileApp);

app.listen(process.env.PORT || 3000);
