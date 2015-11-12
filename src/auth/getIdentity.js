// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var https = require('https'),
    URL = require('url'),
    promises = require('../utilities/promises'),
    log = require('../logger'),
    normalizeClaims = require('./normalizeClaims');

module.exports = function (authConfiguration, token, provider) {
    var endpoint = URL.parse(authConfiguration.issuer);
    
    return promises.create(function (resolve, reject) {
        var requestOptions = {
            hostname: endpoint.hostname,
            port: endpoint.port || 443,
            path: '/.auth/me' + (provider ? '?provider=' + provider : ''),
            method: 'GET',
            headers: {
                'x-zumo-auth': token
            }
        };
        log.verbose('GetIdentity Request: ', requestOptions);
        
        var request = https.request(requestOptions, function (response) {
           log.verbose('GetIdentity Response Code: ', response.statusCode);
           
           var responseData = '';
           response.setEncoding('utf8');
           response.on('data', function (chunk) {
               responseData += chunk;
           });
           response.on('end', function () {
               log.verbose('GetIdentity Response: ', responseData);
               var responseObj = normalizeClaims(JSON.parse(responseData));
               resolve(responseObj);
           });
        });
        
        request.on('error', function (error) {
            log.error('Could not retrieve identity: ', error);
            reject(error);
        });
        
        request.end();
    });
};
