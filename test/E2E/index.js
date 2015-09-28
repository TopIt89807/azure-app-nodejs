// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var bodyParser = require('body-parser'),
    xmlBodyParser = require('express-xml-bodyparser'),
    path = require('path'),
    app = require('express')(),
    mobileApps = require('../..'),
    configuration = require('../../src/configuration'),
    config = configuration.fromEnvironment(configuration.fromFile(path.join(__dirname, 'config.js'))),
    mobileApp;

    config.auth = { secret: 'secret' };

mobileApp = mobileApps(config);
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

app.use(mobileApp);

app.get('/api/jwtTokenGenerator', require('./jwtTokenGenerator')(config));
app.get('/api/runtimeInfo', require('./runtimeInfo'));
app.all('/api/applicationPermission', [bodyParser.json(), bodyParser.text(), xmlBodyParser({ strict: false }), require('./applicationPermission')]);

require('./movieFinder').register(app);

app.listen(process.env.PORT || 3000);
