// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var mobileApps = require('../..'),
    expect = require('chai').expect,
    log = require('../../src/logger');

describe('azure-mobile-apps.configuration', function () {
    var connectionString, logLevel, schemaName;

    beforeEach(function () {
        connectionString = process.env.MS_TableConnectionString;
        logLevel = process.env.MS_MobileLogLevel;
        schemaName = process.env.MS_DatabaseSchemaName;
    });

    afterEach(function () {
        // nasty. we need to sort out our configuration story
        process.env.MS_TableConnectionString = connectionString;
        if(!connectionString) delete process.env.MS_TableConnectionString;
        process.env.MS_MobileLogLevel = logLevel;
        if(!logLevel) delete process.env.MS_MobileLogLevel;
        process.env.MS_DatabaseSchemaName = schemaName;
        if(!schemaName) delete process.env.MS_DatabaseSchemaName;
        log.configure();
    });

    it("does not override configuration with defaults", function () {
        var mobileApp = mobileApps({ tableRootPath: 'test' });
        expect(mobileApp.configuration.tableRootPath).to.equal('test');
    });

    it("sets table configuration from environment variable", function () {
        process.env.MS_TableConnectionString = 'Server=tcp:azure-mobile-apps-test.database.windows.net,1433;Database=e2etest-v2-node;User ID=azure-mobile-apps-test@azure-mobile-apps-test;Password=abc123;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;';
        var mobileApp = mobileApps();
        expect(mobileApp.configuration.data.server).to.equal('azure-mobile-apps-test.database.windows.net');
        expect(mobileApp.configuration.data.port).to.equal(1433);
    });

    it("loads configuration from specified module", function () {
        var mobileApp = mobileApps({ basePath: __dirname, configFile: 'files/config' });
        expect(mobileApp.configuration.value).to.equal('test');
    });

    it("creates logger with logging level ms_mobileloglevel", function () {
        process.env.MS_MobileLogLevel = "verbose";
        var mobileApp = mobileApps();
        expect(mobileApp.configuration.logging).to.have.property('level', process.env.MS_MobileLogLevel);
    });

    it("database schema name is set on each table from ms_databaseschemaname", function () {
        process.env.MS_DatabaseSchemaName = 'schemaName';
        var mobileApp = mobileApps();
        mobileApp.tables.add('test');
        expect(mobileApp.configuration.data.schema).to.equal('schemaName');
        expect(mobileApp.configuration.tables.test.schema).to.equal('schemaName');
    });
});
