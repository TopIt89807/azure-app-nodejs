var rewire = require('rewire'),
    sinon = require('sinon'),
    sinonPromised = require('sinon-as-promised'),
    expect = require('chai')
        .use(require('sinon-chai'))
        .expect,
    request = require('supertest-as-promised'),
    express = require('express'),
    notifStub, notifFactoryStub, app, installation;

var notificationMiddleware = rewire('../../../src/express/middleware/notifications');

describe('azure-mobile-apps.express.integration.notifications', function () {
    beforeEach(function () {
        installation = createInstallation();

        notifStub = createNotificationsStub();
        notifFactoryStub = sinon.stub().returns(notifStub);
        notificationMiddleware.__set__('notifications', notifFactoryStub);

        app = express();
        app.use(notificationMiddleware({ notifications: { hubName: 'name', connString: 'connString' }}));
    });

    it('returns 204 on successful creation', function () {
        return request(app)
            .put('/push/installations/' + installation.installationId)
            .type('json')
            .send(JSON.stringify(installation))
            .expect(204)
            .then(function (res) {
                expect(notifStub.putInstallation).to.be.calledWith(installation.installationId, installation);
            });
    });

    it('returns 400 and message on error', function () {
        installation.installationId = 'errorMessage';
        return request(app)
            .put('/push/installations/' + installation.installationId)
            .type('json')
            .send(JSON.stringify(installation))
            .expect(400)
            .then(function (res) {
                expect(notifStub.putInstallation).to.be.calledWith(installation.installationId, installation);
                expect(res.error.text).to.equal('errorMessage');
            });
    });

    it('returns 400 and bad request message for unspecified error', function () {
        installation.installationId = 'error';
        return request(app)
            .put('/push/installations/' + installation.installationId)
            .type('json')
            .send(JSON.stringify(installation))
            .expect(400)
            .then(function (res) {
                expect(notifStub.putInstallation).to.be.calledWith(installation.installationId, installation);
                expect(res.error.text).to.equal('Bad Request');
            });
    });

    it('strips all tags from installation', function () {
        installation.tags = [ 'tag' ];
        installation.templates.temp1.tags = [ 'tempTag' ];
        installation.secondaryTiles.tile1.tags = [ 'tileTag' ];
        installation.secondaryTiles.tile1.templates.tileTemp.tags = [ 'tileTempTag' ];
        return request(app)
            .put('/push/installations/' + installation.installationId)
            .type('json')
            .send(JSON.stringify(installation))
            .expect(204)
            .then(function (res) {
                expect(notifStub.putInstallation).to.be.calledWith(installation.installationId, createInstallation());
            });
    })

    it('returns 204 on successful deletion', function () {
        return request(app)
            .delete('/push/installations/' + installation.installationId)
            .expect(204)
            .then(function (res) {
                expect(notifStub.deleteInstallation).to.be.calledWith(installation.installationId);
            });
    });

    function createNotificationsStub () {
        var stub = {};
        stub.getClient = sinon.stub().returns('client');

        stub.putInstallation = sinon.stub().resolves('ok');
        stub.putInstallation.withArgs('errorMessage', sinon.match.object)
                .rejects({ message: 'errorMessage' })
        stub.putInstallation.withArgs('error', sinon.match.object)
                .rejects({});

        stub.deleteInstallation = sinon.stub().resolves('ok');
        
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