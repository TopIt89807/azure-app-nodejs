// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var fromSettingsJson = require('../../src/configuration/fromSettingsJson'),
    path = require('path'),
    expect = require('chai').expect;

describe('azure-mobile-apps.configuration.fromSettingsJson', function () {
    it('loads log level from settings.json file', function () {
        var configuration = { basePath: path.join(__dirname, './files/site/wwwroot') };
        expect(fromSettingsJson(configuration).logging.level).to.equal('verbose');
    });
});
