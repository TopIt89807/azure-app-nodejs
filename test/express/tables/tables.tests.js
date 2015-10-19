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

    it('loads table with json config', function () {
        var config = tables({ basePath: __dirname });
        config.import('../files/tables/tableconfig');

        expect(config.configuration).to.have.property('jsontable');
        var tableConfig = config.configuration.jsontable;

        expect(tableConfig).to.have.property('name', 'jsontable');
        expect(tableConfig).to.have.property('softDelete', true);
        expect(tableConfig).to.have.property('dynamicSchema', false);
        expect(tableConfig).to.have.property('authorize', false);
        expect(tableConfig.columns).to.eql({ name: 'string', date1: 'date' });
        expect(tableConfig.indexes).to.eql([ 'name' ]);
    });
});
