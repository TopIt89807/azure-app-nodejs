var bodyParser = require('body-parser'),
    promises = require('azure-mobile-apps/src/utilities/promises'),
    expect = require('chai').expect;

module.exports = {
    register: function (app) {
        app.post('/api/push', [bodyParser.json(), push]);
        app.get('/api/verifyRegisterInstallationResult', getVerifyRegisterInstallationResult);
        app.get('/api/verifyUnregisterInstallationResult', getVerifyUnregisterInstallationResult);
        app.delete('/api/deleteRegistrationsForChannel', deleteRegistrationsForChannel);
    }
};

function push(req, res, next) {
    var data = req.body,
        push = req.azureMobile.push;

    switch(data.type) {
        case 'template':
            promises.wrap(push.send, push)(data.tag, data.payload).then(endRequest);
            break;
        case 'gcm':
            promises.wrap(push.gcm.send, push)(data.tag, data.payload).then(endRequest);
            break;
        case 'apns':
            promises.wrap(push.apns.send, push)(data.tag, data.payload).then(endRequest);
            break;
        case 'wns':
            promises.wrap(push.wns['send' + data.wnsType], push)(data.tag, data.payload).then(endRequest);
            break;
    }

    function endRequest() {
        res.status(200).end();
    }
}

function getVerifyRegisterInstallationResult(req, res, next) {
    var installationId = req.get('x-zumo-installation-id'),
        push = req.azureMobile.push;

    retry(promises.wrap(push.getInstallation, push), [installationId]).then(function (installation) {
        if(installation.pushChannel != req.query.channelUri) {
            next('ChannelUri did not match - ' + installation.pushChannel + ', ' + req.query.channelUri);
            return;
        }

        verifyTemplates();
        verifySecondaryTiles();
        return verifyTags().then(function () {
            res.status(200).end();
        });
        //.catch(function (error) {
        //    res.status(500).send(error);
        //});

        function verifyTemplates() {
            if(req.query.templates) {
                var expectedTemplates = JSON.parse(req.query.templates);
                expect(installation.templates).to.deep.equal(expectedTemplates);
            }
        }

        function verifySecondaryTiles() {
            if(req.query.secondaryTiles) {
                var secondaryTiles = JSON.parse(req.query.secondaryTiles);
                expect(installation.secondaryTiles).to.deep.equal(secondaryTiles);
            }
        }

        function verifyTags() {
            var tag = '$InstallationId:{' + installationId + '}';
            return promises.wrap(push.listRegistrationsByTag, push)(tag).then(function (registrations) {
                registrations.forEach(function (registration) {
                    expect(registration.Tags).to.contain(tag);
                });
            });
            /*
            [ { ETag: '1',
                ExpirationTime: '2016-02-18T20:25:27Z',
                RegistrationId: '8211930789331456559-5803386558100416379-2',
                Tags: '$InstallationId:{c6a23d6a-cdde-4964-ba3d-e86193adf67d}',
                ChannelUri: 'https://bn1.notify.windows.com/?token=AwYAAAACgm30fboVszPgNFCSc7PzSQh5ZAikk4JzRUJQP7i5k9MnvJFAB9NMhJW5At%2fweOOAZZyoLiHdQ3yPFwZprPhFkGXyBBvFg%2f4E3kPpZm6WgmGsdaZf0LUHbFADy1%2bDEjc%3d',
                _:
                 { ContentRootElement: 'WindowsRegistrationDescription',
                   id: 'https://daend2end-namespace.servicebus.windows.net/daend2end-hub/tags/$InstallationId:%7Bc6a23d6a-cdde-4964-ba3d-e86193adf67d%7D/registrations/8211930789331456559-5803386558100416379-2?api-version=2013-07',
                   title: '8211930789331456559-5803386558100416379-2',
                   published: '2015-11-20T20:26:20Z',
                   updated: '2015-11-20T20:26:20Z',
                   link: '' } } ]
            */
        }
    }).catch(next);
}

function getVerifyUnregisterInstallationResult(req, res, next) {
    var installationId = req.get('x-zumo-installation-id'),
        push = req.azureMobile.push;

    retry(promises.wrap(push.getInstallation, push)(installationId))
        .then(function () {
            res.status(500).send("Found deleted installation with id " + installationId);
        })
        .catch(function () {
            res.status(200).end();
        });
}

function deleteRegistrationsForChannel(req, res, next) {
    var installationId = req.get('x-zumo-installation-id'),
        push = req.azureMobile.push;

    retry(promises.wrap(push.deleteInstallation, push), [installationId]).then(function () {
        res.status(200).end();
    })
}

function retry(action, args) {
    return promises.create(function (resolve, reject) {
        var tryCount = 0,
            sleepTimes = [1000, 3000, 5000];

        tryAction();

        function tryAction() {
            try {
                return promises.sleep(sleepTimes[tryCount])
                    .then(function () {
                        action.apply(null, args)
                    })
                    .then(function (result) {
                        resolve(result);
                    })
                    .catch(function (error) {
                        if(tryCount < 2)
                            return tryAction();
                        reject(error);
                    });
            } catch(ex) {
                reject(ex);
            }
        }
    });
}
