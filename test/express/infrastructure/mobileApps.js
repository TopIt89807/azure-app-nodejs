// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var mobileApp = require('../../..'),
    config = require('./config'),
    merge = require('deeply');

var api = module.exports = function (userSuppliedConfig, environment) {
    return mobileApp.buildApp(config(userSuppliedConfig, environment));
};

api.ignoreEnv = function (userSuppliedConfig, environment) {
    return mobileApp.buildApp(config.ignoreEnv(userSuppliedConfig, environment));
};

api.table = mobileApp.table;
api.ignoreEnv.table = mobileApp.table;