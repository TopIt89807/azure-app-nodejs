// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').expect,
    templates = require('../../src/templates');

describe('azure-mobile-apps.templates', function () {
    it("renders specified template through util.format", function () {
        expect(templates('authStub.html', '1', '2', '3')).to.contain('ID: 3');
    });
});
