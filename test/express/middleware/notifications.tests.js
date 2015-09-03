// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var rewire = require('rewire'),
    expect = require('chai').expect,

    middleware = rewire('../../../src/express/middleware/notifications'),
    config = {
        notifications: {
            hubName: 'name',
            connString: 'connString'
        }
    },
    req;

    middleware.__set__('notifications', function (configuration) {
        return {
            getClient: function () { return 'client'; }
        };
    });

describe('azure-mobile-apps.express.middleware.notifications', function () {
    beforeEach(function () {
        req = { method: 'get', url: 'http://url'};
    });

    it('attaches push context', function (done) {
        var router = middleware(config);

        router(req, {}, function () {
            try {
                expect(req.azureMobile.push).to.equal('client');
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('returns empty router if no config', function () {
        var router = middleware({ notifications: {}});
        expect(router.stack).to.have.length(0);
    });
});
