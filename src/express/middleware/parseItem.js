// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var bodyParser = require('body-parser'),
    errors = require('../../utilities/errors'),
    strings = require('../../utilities/strings'),
    types = require('../../utilities/types'),
    uuid = require('node-uuid');

module.exports = function (table) {
    return [
        attachTableContext,
        parseItem,
        configureItem
    ];

    function attachTableContext (req, res, next) {
        req.azureMobile.table = table;
        next();
    }

    function parseItem (req, res, next) {
        // by default, we are going to parse json
        if (!req.headers['content-type'])
            req.headers['content-type'] = 'application/json';

        if (!req.body && req.headers['content-type'].indexOf('application/json') > -1) {
            bodyParser.json()(req, res, function (error) {
                if(error)
                    error.badRequest = true;
                next(error);
            });
        } else {
            // if the request specified something other than json, assume another parser middleware is going to handle it
            next();
        }
    }

    function configureItem (req, res, next) {
        var item = req.body;

        if (types.isObject(item)) {
            if(!idsMatch(item)) {
                next(errors.badRequest('The item ID and querystring ID did not match'));
            } else {
                // for PATCH operations, the ID can come from the querystring
                // if no id was specified by the client, set one here. This will be overwritten by autoIncrement if set
                item.id = req.params.id || item.id || uuid.v4();

                // set version property from if-match header, if specified
                var etag = req.get('if-match');
                if(etag) {
                    item.version = strings.getVersionFromEtag(etag);
                }
            }
        }

        req.azureMobile.item = item;
        next();

        function idsMatch(item) {
            return item.id === undefined || req.params.id === undefined || item.id.toString() === req.params.id.toString();
        }
    }
};
