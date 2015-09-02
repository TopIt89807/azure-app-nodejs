// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var app = require('express')(),
    mobileApp = require('azure-mobile-apps')();

mobileApp.tables.add('todoitem');
mobileApp.attach(app);

app.listen(process.env.PORT || 3000);
