// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var authModule = require('../../src/auth'),
    expect = require('chai').expect;

describe('azure-mobile-apps.auth', function () {
    it('signs and validates tokens', function () {
        var auth = authModule({ secret: 'secret' }),
            token = auth.sign({ claim: 'claim', sub: 'id' });

        return auth.validate(token).then(function (user) {
            expect(user.id).to.equal('id');
        });
    });

    it('validates audience and issuer', function () {
        var auth = authModule({ secret: 'secret' }),
            audienceChecker = authModule({ secret: 'secret', audience: 'audience' }),
            issuerChecker = authModule({ secret: 'secret', issuer: 'issuer' }),
            token = auth.sign({ claim: 'claim', sub: 'id' });

        return audienceChecker.validate(token).then(expect.fail)
            .catch(function () {
                return issuerChecker.validate(token).then(expect.fail).catch(function () {});
            });
    });

    it('payload expiry takes precedence over options', function () {
        var auth = authModule({ secret: 'secret', expires: 1440 }),
            token = auth.sign({ claim: 'claim', sub: 'id', exp: 9999999 });

        expect(auth.decode(token).claims.exp).to.equal(9999999);
    });
});
