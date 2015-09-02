// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var rewire = require('rewire'),
    sinon = require('sinon'),
    expect = require('chai')
            .use(require('chai-as-promised'))
            .use(require('sinon-chai'))
            .expect,

    notifications = rewire('../../src/notifications'),
    nhStub,
    inst,
    installation;

describe('azure-mobile-apps.notifications.installation', function () {
    beforeEach(function () {
        nhStub = {};
        nhStub.createOrUpdateInstallation = sinon.stub();
        nhStub.deleteInstallation = sinon.stub();
        nhStub.listRegistrationsByTag = sinon.stub().returns([]);
        nhStub.constr = sinon.stub().returns({
            createOrUpdateInstallation: nhStub.createOrUpdateInstallation,
            deleteInstallation: nhStub.deleteInstallation,
            listRegistrationsByTag: nhStub.listRegistrationsByTag
        });
        notifications.__set__("NotificationHubService", nhStub.constr);

        installation = {
            installationId: 'id',
            pushChannel: 'channel',
            platform: 'wns',
            templates: {
                temp1: {
                    headers: {
                        header: 'header'
                    },
                    body: 'body'
                }
            },
            secondaryTiles: {
                tile1: {
                    pushChannel: 'tileChannel',
                    templates: {
                        tileTemp: {
                            headers: {
                                header: 'header'
                            },
                            body: 'body'
                        }
                    }
                }
            }
        };
    });

    it('deletes installation', function () {
        inst = notifications({});

        inst.deleteInstallation('id');

        expect(nhStub.deleteInstallation).to.be.calledWith('id');
    });

    it('creates installation', function () {
        inst = notifications({});

        inst.putInstallation('id', {

        })
    })
});
