// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var expect = require('chai').use(require('chai-subset')).expect,
    supertest = require('supertest-as-promised'),
    express = require('express'),
    mobileApps = require('../../../appFactory'),
    auth = require('../../../../src/auth'),

    app, mobileApp;

describe('azure-mobile-apps.express.integration.filters.perUser', function () {
    beforeEach(function () { setup(); });
    afterEach(mobileApps.cleanUp(mobileApps.configuration()).testTable({ name: 'perUser' }));

    it("attaches user id property to item", function () {
        return request('post', null, 'user1', 201, { id: '1', value: 'test' })()
            .then(request('get', '1', 'user1', 200))
            .then(validateProperty('userId', 'user1'));
    });

    it("allows all operations on records created by a user", function () {
        return request('post', null, 'user1', 201, { id: '1', value: 'test' })()
            .then(request('get', '1', 'user1', 200))
            .then(request('patch', '1', 'user1', 200, { value: 'test2' }))
            .then(request('delete', '1', 'user1', 200))
            .then(request('post', '1', 'user1', 201));
    });

    it("disallows all operations on records not created by a user", function () {
        return request('post', null, 'user1', 201, { id: '1', value: 'test' })()
            .then(request('get', '1', 'user2', 404))
            .then(request('get', '1', null, 404))
            .then(request('patch', '1', 'user2', 404, { value: 'test2' }))
            .then(request('delete', '1', 'user2', 404))
            .then(request('post', '1', 'user2', 404));
    });

    it("restricts queries to specific users", function () {
        return request('post', null, 'user1', 201, { id: '1', value: 'test1' })()
            .then(request('post', null, 'user1', 201, { id: '2', value: 'test2' }))
            .then(request('post', null, 'user2', 201, { id: '3', value: 'test1' }))
            .then(request('post', null, 'user2', 201, { id: '4', value: 'test2' }))
            .then(request('get', null, null, 200))
            .then(validateIds([]))
            .then(request('get', null, 'user1', 200))
            .then(validateIds(['1', '2']))
            .then(request('get', "?$filter=value eq 'test1'", 'user1', 200))
            .then(validateIds(['1']))
            .then(request('get', "?$filter=value eq 'test2'", 'user2', 200))
            .then(validateIds(['4']));
    });

    it("uses user id column name specified on table", function () {
        setup({ perUser: true, userIdColumn: 'table_user_id' });
        return request('post', null, 'user1', 201, { id: '1', value: 'test' })()
            .then(request('get', '1', 'user1', 200))
            .then(validateProperty('table_user_id', 'user1'));
    });

    it("uses default user id column name specified in configuration", function () {
        setup({ perUser: true }, { userIdColumn: 'config_user_id' });
        return request('post', null, 'user1', 201, { id: '1', value: 'test' })()
            .then(request('get', '1', 'user1', 200))
            .then(validateProperty('config_user_id', 'user1'));
    });

    it("creates required columns when initialized", function () {
        var table = mobileApp.table();
        table.read(function(context) {
            return context.data({ name: 'perUser' }).schema().then(function (schema) {
                expect(schema.properties.filter(function (x) { return x.name === 'userId'; })[0].type).to.equal('string');
                return [];
            });
        });
        table.perUser = true;
        setup(table);
        return mobileApp.tables.initialize().then(request('get', null, 'user1', 200));
    });

    function setup(table, configuration) {
        app = express();
        mobileApp = mobileApps(configuration);
        mobileApp.tables.add('perUser', table || { perUser: true, softDelete: true });
        app.use(mobileApp);
    }

    function request(method, id, userId, expectedResponse, body) {
        return function () {
            var url = '/tables/perUser' + (id ? '/' + id : ''),
                req = supertest(app)[method](url);

            if(userId) req.set('x-zumo-auth', token(userId));
            if(body) req.send(body);

            return req.expect(expectedResponse);
        };
    }

    function token(userId) {
        return auth(mobileApp.configuration.auth).sign({ sub: userId });
    }

    function validateIds(ids) {
        return function (results) {
            expect(results.body.length).to.equal(ids.length);
            ids.forEach(function (id, index) {
                expect(results.body[index].id).to.equal(id);
            });
        }
    }

    function validateProperty(property, value) {
        return function (results) {
            expect(results.body[property]).to.equal(value);
        };
    }
});