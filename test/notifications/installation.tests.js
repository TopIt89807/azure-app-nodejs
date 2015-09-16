// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var sinon = require('sinon'),
    expect = require('chai')
            .use(require('sinon-chai'))
            .expect,
    notifications = require('../../src/notifications'),
    clientStub, notifs, installation;

describe('azure-mobile-apps.notifications.installation', function () {
    beforeEach(function () {
        installation = createInstallation();
        clientStub = createNHClientStub();
        notifs = notifications({ client: clientStub });
    });

    it('deletes installation', function () {
        return notifs.deleteInstallation('id')
            .then(function (res) {
                expect(clientStub.deleteInstallation).to.be.calledWith('id');
            });
    });

    it('creates basic installation', function () {
        return notifs.putInstallation('id', installation)
            .then(function (res) {
                expect(clientStub.createOrUpdateInstallation).to.be.calledWith(installation);
            });
    });

    it('creates installation with supplied id', function () {
        return notifs.putInstallation('test', installation)
            .then(function (res) {
                var arg = clientStub.createOrUpdateInstallation.args[0][0];
                expect(arg.installationId).to.equal('test');
            });
    });

    it('creates installation with user', function () {
        return notifs.putInstallation('id', installation, 'user')
            .then(function (res) {
                var arg = clientStub.createOrUpdateInstallation.args[0][0];
                expect(arg.tags).to.deep.equal([ '_UserId:user' ]);
            });
    });

    it('creates installation with tags', function () {
        return notifs.putInstallation('tags', installation)
            .then(function (res) {
                expect(clientStub.listRegistrationsByTag).to.be.calledTwice;
                var arg = clientStub.createOrUpdateInstallation.args[0][0];
                expect(arg.tags).to.deep.equal(['tag1', 'tag2']);
            });
    });

    it('creates installation with user and tags', function () {
        return notifs.putInstallation('tags', installation, 'user')
            .then(function (res) {
                expect(clientStub.listRegistrationsByTag).to.be.calledTwice;
                var arg = clientStub.createOrUpdateInstallation.args[0][0];
                expect(arg.tags).to.deep.equal(['tag1', 'tag2', '_UserId:user']);
            });
    });

    function createNHClientStub () {
        var stub = {};
        stub.createOrUpdateInstallation = sinon.stub().yields(undefined, 'ok');
        stub.deleteInstallation = sinon.stub().yields(undefined, 'ok');
        stub.listRegistrationsByTag = sinon.stub().yields(undefined, []);
        stub.listRegistrationsByTag.withArgs('$InstallationId:{tags}')
                .onCall(0).yields(undefined, [{ Tag: 'tag1' }, { Tag: 'tag2'} ]);

        return stub;
    }

    function createInstallation () {
        return {
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
    }
});
