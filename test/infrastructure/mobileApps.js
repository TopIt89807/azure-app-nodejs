// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var mobileApp = require('../..'),
    config = require('./config');

var api = module.exports = function (suppliedConfig, environment) {
    return mobileApp.create(config(suppliedConfig, environment));
};

api.ignoreEnv = function (suppliedConfig, environment) {
    return mobileApp.create(config.ignoreEnv(suppliedConfig, environment));
};

api.table = mobileApp.table;
api.ignoreEnv.table = mobileApp.table;
