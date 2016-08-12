// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var log = require('../../logger');

module.exports = {
    filter: function (query, context) {
        executeWebhook(context);
    },
    transform: function (item, context) {
        // transforms are also executed for updates, but let the filter handle the webhook for updates
        if(context.operation === 'create')
            executeWebhook(context);
    }
};

function executeWebhook(context) {
    var url = (context.table.webhook && context.table.webhook.url)
        || (context.configuration.webhook && context.configuration.webhook.url);
    
    if(!url)
        log.error("Unable to connect to webhook: URL not specified");

    request(url, {
        operation: context.operation,
        item: context.item,
        id: context.id
    });
}

var http = require('http'),
    https = require('https'),
    parseUrl = require('url').parse;

function request(url, payload) {
    var parsed = parseUrl(url),
        client = parsed.protocol === 'https' ? https : http,
        serialized = JSON.stringify(payload),
        options = {
            hostname: parsed.hostname,
            port: parsed.port,
            path: parsed.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': serialized.length
            }
        };
    
    var req = client.request(options);

    req.on('error', function (err) {
        log.error("Unable to connect to webhook:", err);        
    });

    req.write(serialized);
    req.end();
}