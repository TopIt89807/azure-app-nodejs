// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../../src/configuration'),
    path = require('path');

module.exports = configuration.fromEnvironment(configuration.fromFile(path.resolve(__dirname, '../../../config.js'))).data;
