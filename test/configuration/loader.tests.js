// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    path = require('path');

describe('azure-mobile-apps.configuration.loader', function () {
    var loader = requireWithRefresh('../../src/configuration/loader');

    it('loads configuration from single file', function () {
        var configuration = loader.loadPath('./files/tables/table1');
        expect(configuration).to.deep.equal({
            table1: { authenticate: true }
        });
    });

    it('loads configuration recursively from directory and adds to target', function () {
        var configuration = loader.loadPath('./files/tables');
        expect(configuration).to.deep.equal({
            table1: { authenticate: true },
            table2: { authenticate: false },
            table3: { softDelete: true }
        });
    });

    it('loads files specified with .js extension', function () {
        var configuration = loader.loadPath('./files/tables/table1.js');
        expect(configuration).to.deep.equal({
            table1: { authenticate: true }
        });
    });

    it('loads relative to basePath', function () {
        var configuration = loader.loadPath('./configuration/files/tables/table1.js', path.resolve(__dirname, '..'));
        expect(configuration).to.deep.equal({
            table1: { authenticate: true }
        });
    });
});

function requireWithRefresh(path) {
    var modulePath = require.resolve(path);
    delete require.cache[modulePath];
    return require(path);
}
