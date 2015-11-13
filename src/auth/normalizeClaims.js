// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

module.exports = function (claims) {
    var normalizedClaims = claims.reduce(function (object, value, index) {
        object[value['provider_name']] = value;
        return object;
    }, {});
	
    for (var idp in normalizedClaims) {
        normalizedClaims[idp].claims = normalizedClaims[idp].user_claims.reduce(function (object, value, index) {
            object[value.typ] = value.val;
			if (value.typ.indexOf('http://schemas.xmlsoap.org/ws') !== -1) {
			    object[value.typ.slice(value.typ.lastIndexOf('/')+1)] = value.val;
            }
            return object;
        }, {});
    }
	
    return normalizedClaims;
};
