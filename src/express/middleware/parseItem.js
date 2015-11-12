// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var bodyParser = require('body-parser'),
    strings = require('../../utilities/strings'),
    uuid = require('node-uuid');

module.exports = function (table) {
    return function (req, res, next) {
        req.azureMobile.table = table;
        bodyParser.json()(req, res, callback);

        function callback(error) {
            if(error) {
                next(error);
            } else {
                var item = req.body;

                if(!idsMatch()) {
                    next(badRequest('The item ID and querystring ID did not match'));
                } else {
                    // for PATCH operations, the ID can come from the querystring
                    // if no id was specified by the client, set one here. This will be overwritten by autoIncrement if set
                    item.id = req.params.id || item.id || uuid.v4();

                    // set version property from if-match header, if specified
                    var etag = req.get('if-match');
                    if(etag) {
                        item.version = strings.getVersionFromEtag(etag);
                    }

                    req.azureMobile.item = item;
                    next();
                }

                function idsMatch() {
                    return item.id === undefined || req.params.id === undefined || item.id.toString() === req.params.id.toString();
                }
            }
        }

        function badRequest(message) {
            var error = new Error(message);
            error.badRequest = true;
            return error;
        }
    };
};
