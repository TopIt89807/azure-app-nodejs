// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration'),
    path = require('path');

var api = module.exports = function () {
    var config = configuration.fromEnvironment(configuration.fromFile(path.resolve(__dirname, '../../config.js')));
    config.basePath = __dirname;
    return config;
}

api.data = function () {
    return api().data;
};
