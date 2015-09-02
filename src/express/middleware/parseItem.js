// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var bodyParser = require('body-parser'),
    uuid = require('node-uuid');

module.exports = function (table) {
    return function (req, res, next) {
        req.azureMobile.table = table;
        bodyParser.json()(req, res, callback);

        function callback(error) {
            if(error)  {
                next(error);
            } else {
                var item = req.body;

                // if no id was specified by the client, set one here. This will be overwritten by autoIncrement if set
                item.id = item.id || uuid.v4();

                // set version property from if-match header, if specified
                var etag = req.get('if-match');
                if(etag) {
                    req.azureMobile.version = etag;
                    item.__version = etag;
                }

                req.azureMobile.item = item;
                next();
            }
        }
    };
};
