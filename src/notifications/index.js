// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var util = require('util'),
    promises = require('../utilities/promises'),
    NotificationHubService = require('azure-sb').NotificationHubService,
    InstallationIdTag = "$InstallationId:{%s}",
    UserIdTagPrefix = "_UserId:";

module.exports = function (configuration) {
    var nhClient = new NotificationHubService(configuration.hubName, configuration.connectionString 
        || configuration.endpoint, configuration.sharedAccessKeyName, configuration.sharedAccessKeyValue);

    return {
        nhClient: nhClient,
        putInstallation: createOrUpdateInstallation,
        deleteInstallation: deleteInstallation
    };

    function createOrUpdateInstallation(installationId, installation, user) {
        installation.installationId = installationId;
        return getTagsByInstallationId(installationId)
            .then(function (tags) {
                installation.tags = addUserTag(tags, user);
                return promises.create(function (result, reject) {
                    nhClient.createOrUpdateInstallation(installation, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            result(res);
                        }
                    });
                });                
            });
    }

    function deleteInstallation(installationId) {
        return promises.create(function (result, reject) {
            nhClient.deleteInstallation(installationId, function (err, res) {
                if (err) {
                    return reject(err);
                } else {
                    return result(res);
                }
            });
        });
    }

    function getTagsByInstallationId(installationId) {
        var installationIdAsTag = util.format(InstallationIdTag, installationId);
        
        return mapRegistrations(installationIdAsTag, function (registration) { return registration.Tag });
    }

    function addUserTag(tags, user) {
        if (user) {
            tags = tags.filter(function (tag) {
                return !tag.startsWith(UserIdTagPrefix);
            });
            tags.push(UserIdTagPrefix + user);
        }
        return tags;
    }

    function mapRegistrations(tag, mapFunc) {
        var mapFunction = mapFunc;

        return promises.create(function (result, reject) {
            var mapFunc = mapFunc || function (registration) { return registration; };
            var results = [];
            // nh limits to 100 registrations per call
            listRegistrations(100, 0);

            function listRegistrations(top, skip) {
                nhClient.listRegistrationsByTag(tag, { top: top, skip: skip }, function (err, res) {
                    if (err) {
                        reject(err);
                    } else if (res.length === 0) {
                        result(results);
                    } else {
                        results = results.concat(res.map(mapFunction));
                        listRegistrations(top, skip + top);
                    }
                });
            }
        });
    }
}