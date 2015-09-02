// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var expect = require('chai').expect,
    tables = require('../../../src/express/tables');

describe('azure-mobile-apps.express.tables', function() {
    it("imports table configuration for file", function () {
        var config = tables({ basePath: __dirname });
        config.import('../files/tables/table1');
        expect(config.configuration.table1).to.not.be.undefined;
    });

    it("imports table configuration for empty file", function () {
        var config = tables({ basePath: __dirname });
        config.import('../files/tables/empty');
        expect(config.configuration.empty).to.not.be.undefined;
    });
});
