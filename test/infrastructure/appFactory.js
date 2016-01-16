// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var mobileApps = require('../..'),
    configuration = require('./configuration');

var api = module.exports = function (suppliedConfiguration, environment) {
    return mobileApps.create(configuration(suppliedConfiguration, environment));
};

api.ignoreEnvironment = function (suppliedConfiguration, environment) {
    return mobileApps.create(configuration.ignoreEnvironment(suppliedConfiguration, environment));
};

api.table = mobileApps.table;
api.ignoreEnvironment.table = mobileApps.table;
