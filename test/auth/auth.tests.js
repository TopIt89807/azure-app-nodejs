// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var authModule = require('../../src/auth'),
    expect = require('chai').expect;

describe('azure-mobile-apps.auth', function () {
    it('signs and validates tokens', function () {
        var auth = authModule({ secret: 'secret' }),
            token = auth.sign({ claim: 'claim', uid: 'id' });

        return auth.validate(token).then(function (user) {
            expect(user.id).to.equal('id');
        });
    })
})
