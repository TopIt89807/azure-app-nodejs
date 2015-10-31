// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var config = require('./infrastructure/config'),
    data = require('../../../src/data')(config),
    execute = require('../../../src/data/sql/execute'),
    expect = require('chai').expect,
    table = { name: 'initialize' };

describe('azure-mobile-apps.data.sql.integration.initialize', function () {
    afterEach(function (done) {
        execute(config, { sql: 'drop table dbo.initialize' }).then(done, done);
    });
});
