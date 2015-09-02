// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var bodyParser = require('body-parser'),
    xmlBodyParser = require('express-xml-bodyparser'),
    path = require('path'),
    app = require('express')(),
    mobileApps = require('../..'),
    config = configuration.fromEnvironment(configuration.fromFile(path.join(__dirname, 'config.js')));

    config.auth = { secret: 'secret' };

mobileApp.tables.add('authenticated', { authorise: true });
mobileApp.tables.add('blog_comments', { columns: { postId: 'string', commentText: 'string', name: 'string', test: 'number' } });
mobileApp.tables.add('blog_posts', { columns: { title: 'string', commentCount: 'number', showComments: 'boolean', data: 'string' } });
mobileApp.tables.add('dates', { columns: { date: 'date', dateOffset: 'date' } });
mobileApp.tables.add('movies', { columns: { title: 'string', duration: 'number', mpaaRating: 'string', releaseDate: 'date', bestPictureWinner: 'boolean' } });
mobileApp.tables.add('IntIdRoundTripTable', { autoIncrement: true, columns: { name: 'string', date1: 'date', bool: 'boolean', integer: 'number', number: 'number' } });
mobileApp.tables.add('intIdMovies', { autoIncrement: true, columns: { title: 'string', duration: 'number', mpaaRating: 'string', releaseDate: 'date', bestPictureWinner: 'boolean' } });
mobileApp.tables.add('OfflineReady');
mobileApp.tables.add('OfflineReadyNoVersionAuthenticated', { authorise: true });

var roundTrip = mobileApp.table();
roundTrip.update(function (context) {
    return context.execute()
        .catch(function (error) {
            if(context.req.query.conflictPolicy === 'clientWins') {
                context.item.__version = error.item.__version;
                return context.execute();
            } else if (context.req.query.conflictPolicy === 'serverWins') {
                return error.item;
            } else {
                throw error;
            }
        });
});
roundTrip.columns = { name: 'string', date1: 'date', bool: 'boolean', integer: 'number', number: 'number' };
mobileApp.tables.add('roundTripTable', roundTrip);

var parameterTest = mobileApp.table();
parameterTest.autoIncrement = true;
parameterTest.read(function (context) {
    // read operations expect to return an array... this could be improved
    return [mapParameters(context)];
});
parameterTest.insert(mapParameters);
parameterTest.update(mapParameters);
parameterTest.delete(mapParameters);
mobileApp.tables.add('ParamsTestTable', parameterTest);

function mapParameters(context) {
    var id = parseInt(context.id || context.req.query.id || '1');
    return {
        id: id,
        parameters: JSON.stringify(context.req.query)
    };
}

mobileApp.attach(app);

app.get('/api/jwtTokenGenerator', function (req, res, next) {
    // we're not testing key signing - this is done by the gateway or easyauth. just return a precanned token, signed with the key 'secret' (hashed with sha256)
    res.status(200).send('{"token":{"audiences":["urn:microsoft:windows-azure:zumo"],"claims":[{"m_issuer":"urn:microsoft:windows-azure:zumo","m_originalIssuer":"urn:microsoft:windows-azure:zumo","m_type":"ver","m_value":"3","m_valueType":"http://www.w3.org/2001/XMLSchema#string"},{"m_issuer":"urn:microsoft:windows-azure:zumo","m_originalIssuer":"urn:microsoft:windows-azure:zumo","m_type":"uid","m_value":"Facebook:someuserid@hotmail.com","m_valueType":"http://www.w3.org/2001/XMLSchema#string"},{"m_issuer":"urn:microsoft:windows-azure:zumo","m_originalIssuer":"urn:microsoft:windows-azure:zumo","m_type":"iss","m_value":"urn:microsoft:windows-azure:zumo","m_valueType":"http://www.w3.org/2001/XMLSchema#string"},{"m_issuer":"urn:microsoft:windows-azure:zumo","m_originalIssuer":"urn:microsoft:windows-azure:zumo","m_type":"aud","m_value":"urn:microsoft:windows-azure:zumo","m_valueType":"http://www.w3.org/2001/XMLSchema#string"},{"m_issuer":"urn:microsoft:windows-azure:zumo","m_originalIssuer":"urn:microsoft:windows-azure:zumo","m_type":"exp","m_value":"1440009424","m_valueType":"JSON","m_properties":{"http://schemas.xmlsoap.org/ws/2005/05/identity/claimproperties/json_type":"System.Int64"}},{"m_issuer":"urn:microsoft:windows-azure:zumo","m_originalIssuer":"urn:microsoft:windows-azure:zumo","m_type":"nbf","m_value":"1437417424","m_valueType":"JSON","m_properties":{"http://schemas.xmlsoap.org/ws/2005/05/identity/claimproperties/json_type":"System.Int64"}}],"encodedHeader":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9","encodedPayload":"eyJ2ZXIiOiIzIiwidWlkIjoiRmFjZWJvb2s6c29tZXVzZXJpZEBob3RtYWlsLmNvbSIsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8iLCJleHAiOjE0NDAwMDk0MjQsIm5iZiI6MTQzNzQxNzQyNH0","header":{"typ":"JWT","alg":"HS256"},"issuer":"urn:microsoft:windows-azure:zumo","payload":{"ver":"3","uid":"Facebook:someuserid@hotmail.com","iss":"urn:microsoft:windows-azure:zumo","aud":"urn:microsoft:windows-azure:zumo","exp":1440009424,"nbf":1437417424},"rawData":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXIiOiIzIiwidWlkIjoiRmFjZWJvb2s6c29tZXVzZXJpZEBob3RtYWlsLmNvbSIsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8iLCJleHAiOjE0NDAwMDk0MjQsIm5iZiI6MTQzNzQxNzQyNH0.9EvyzV53b2SkBCc46GR4N77NU-3SJEuYzQl8lmlp7QY","rawHeader":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9","rawPayload":"eyJ2ZXIiOiIzIiwidWlkIjoiRmFjZWJvb2s6c29tZXVzZXJpZEBob3RtYWlsLmNvbSIsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8iLCJleHAiOjE0NDAwMDk0MjQsIm5iZiI6MTQzNzQxNzQyNH0","rawSignature":"9EvyzV53b2SkBCc46GR4N77NU-3SJEuYzQl8lmlp7QY","securityKeys":[],"signatureAlgorithm":"HS256","signingCredentials":{"digestAlgorithm":"http://www.w3.org/2001/04/xmlenc#sha256","signatureAlgorithm":"http://www.w3.org/2001/04/xmldsig-more#hmac-sha256","signingKey":{"keySize":256}},"validFrom":"2015-07-20T18:37:04Z","validTo":"2015-08-19T18:37:04Z"}}');
});

//app.all('/api/applicationPermission', [bodyParser.json(), require('./applicationPermission')]);
app.all('/api/applicationPermission', [bodyParser.json(), bodyParser.text(), xmlBodyParser({ strict: false }), require('./applicationPermission')]);

require('./movieFinder').register(app);

app.listen(process.env.PORT || 3000);
