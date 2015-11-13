// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

module.exports = function (claims) {
    return claims.reduce(function (target, identity) {
        target[identity['provider_name']] = identity;
        target[identity['provider_name']].claims = identity.user_claims.reduce(mapClaims, {});
        return target;
    }, {});

    function mapClaims(target, claim) {
        target[claim.typ] = claim.val;
        if (claim.typ.indexOf('http://schemas.xmlsoap.org/ws') !== -1) {
            target[claim.typ.slice(claim.typ.lastIndexOf('/') + 1)] = claim.val;
        }
        return target;
    }
};
