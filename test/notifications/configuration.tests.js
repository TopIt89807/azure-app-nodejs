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
        nhStub = {};
        nhStub.createOrUpdateInstallation = sinon.stub();
        nhStub.deleteInstallation = sinon.stub();
        nhStub.constr = sinon.stub().returns({
            createOrUpdateInstallation: nhStub.createOrUpdateInstallation,
            deleteInstallation: nhStub.deleteInstallation
        });
        notifications.__set__("NotificationHubService", nhStub.constr);
    });

    it('passes connectionString settings to NH', function () {
        notifications({
            hubName: 'name',
            connectionString: 'connString'
        });

        expect(nhStub.constr).to.be.calledWith('name', 'connString');
    });

    it('passes endpoint settings to NH', function () {
        notifications({
            hubName: 'name',
            endpoint: 'endpoint',
            sharedAccessKeyName: 'sak',
            sharedAccessKeyValue: 'sakv'
        });

        expect(nhStub.constr).to.be.calledWith('name', 'endpoint', 'sak', 'sakv');
    });
});
