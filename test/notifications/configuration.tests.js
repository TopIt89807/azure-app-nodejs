// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var rewire = require('rewire'),
    sinon = require('sinon'),
    expect = require('chai')
            .use(require('sinon-chai'))
            .expect,

    notifications = rewire('../../src/notifications'),
    nhStub;

describe('azure-mobile-apps.notifications.configuration', function () {
    beforeEach(function () {
        nhStub = sinon.stub();
        notifications.__set__("NotificationHubService", nhStub);
    });

    it('passes connectionString settings to NH', function () {
        notifications({
            hubName: 'name',
            connectionString: 'connString'
        });

        expect(nhStub).to.be.calledWith('name', 'connString');
    });

    it('passes endpoint settings to NH', function () {
        notifications({
            hubName: 'name',
            endpoint: 'endpoint',
            sharedAccessKeyName: 'sak',
            sharedAccessKeyValue: 'sakv'
        });

        expect(nhStub).to.be.calledWith('name', 'endpoint', 'sak', 'sakv');
    });
});
