// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var mobileApps = require('../..'),
    expect = require('chai').expect,
    log = require('../../src/logger');

describe('azure-mobile-apps.configuration', function () {
    it("does not override configuration with defaults", function () {
        var mobileApp = mobileApps({ tableRootPath: 'test' }, { });
        expect(mobileApp.configuration.tableRootPath).to.equal('test');
    });

    it("sets table configuration from environment variable", function () {
        var environment = { MS_TableConnectionString: 'Server=tcp:azure-mobile-apps-test.database.windows.net,1433;Database=e2etest-v2-node;User ID=azure-mobile-apps-test@azure-mobile-apps-test;Password=abc123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;' },
            mobileApp = mobileApps(undefined, environment);
        expect(mobileApp.configuration.data.server).to.equal('azure-mobile-apps-test.database.windows.net');
        expect(mobileApp.configuration.data.port).to.equal(1433);
    });

    it("sets does not overwrite data configuration values", function () {
        var environment = {
                MS_TableSchema: 'schema',
                MS_TableConnectionString: 'Server=tcp:azure-mobile-apps-test.database.windows.net,1433;Database=e2etest-v2-node;User ID=azure-mobile-apps-test@azure-mobile-apps-test;Password=abc123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
            },
            mobileApp = mobileApps(undefined, environment);

        expect(mobileApp.configuration.data.server).to.equal('azure-mobile-apps-test.database.windows.net');
        expect(mobileApp.configuration.data.port).to.equal(1433);
        expect(mobileApp.configuration.data.schema).to.equal('schema');
    });

    it("loads configuration from specified module", function () {
        var mobileApp = mobileApps({ basePath: __dirname, configFile: 'files/config' });
        expect(mobileApp.configuration.value).to.equal('test');
    });

    it("creates logger with logging level ms_mobileloglevel", function () {
        var environment = { MS_MobileLogLevel: "verbose" },
            mobileApp = mobileApps(undefined, environment);
        expect(mobileApp.configuration.logging).to.have.property('level', environment.MS_MobileLogLevel);
    });

    it("database schema name is set on each table from ms_tableschema", function () {
        var environment = { MS_TableSchema: 'schemaName' },
            mobileApp = mobileApps(undefined, environment);
        mobileApp.tables.add('test');
        expect(mobileApp.configuration.data.schema).to.equal('schemaName');
        expect(mobileApp.configuration.tables.test.schema).to.equal('schemaName');
    });
});
