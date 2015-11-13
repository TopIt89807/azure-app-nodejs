// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

module.exports = function (claims) {
    var normalizedClaims = claims.reduce(function (obj, value, idx) {
        obj[value['provider_name']] = value;
        return obj;
    }, {});
	
    for (var idp in normalizedClaims) {
        normalizedClaims[idp].claims = normalizedClaims[idp].user_claims.reduce(function (obj, value, idx) {
            obj[value.typ] = value.val;
			if (value.typ.startsWith('http://schemas.xmlsoap.org/ws')) {
			    obj[value.typ.slice(value.typ.lastIndexOf('/')+1)] = value.val;
            }
            return obj;
        }, {});
    }
	
    return normalizedClaims;
};
