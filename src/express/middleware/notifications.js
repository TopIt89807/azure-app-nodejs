// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var express = require('express'),
    bodyParser = require('body-parser'),
    notifications = require('../../notifications'),
    log = require('../../logger');

module.exports = function (configuration) {
    var router = express.Router(),
        installationClient;

    if (configuration && configuration.notifications && Object.keys(configuration.notifications).length > 0) {
        router.use(addPushContext);
        router.route('/:installationId')
            .put(bodyParser.json({ reviver: stripTags }), put, errorHandler)
            .delete(del, errorHandler);

        installationClient = notifications(configuration.notifications);
    }

    return router;

    function addPushContext(req, res, next) {
        req.azureMobile = req.azureMobile || {};
        req.azureMobile.push = installationClient.getClient();
        next();
    }

    function put(req, res, next) {
        var installationId = req.params.installationId,
            installation = req.body,
            user = req.azureMobile.user;

        installationClient.putInstallation(installationId, installation, user)
            .then(function (result) {
                res.status(204).end();
            })
            .catch(next);
    }

    function del(req, res, next) {
        var installationId = req.params.installationId;

        installationClient.deleteInstallation(installationId)
            .then(function (result) {
                res.status(204).end();
            })
            .catch(next);
    }

    function errorHandler(err, req, res, next) {
        log.error(err);
        res.status(400).send(err.message || 'Bad Request');
    }

    function stripTags(key, val) {
        if (key.toLowerCase() !== 'tags')
            return val;
    }
}
