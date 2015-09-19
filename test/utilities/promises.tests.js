var promises = require('../../src/utilities/promises'),
    expect = require('chai').expect;

describe('azure-mobile-apps.utilities.promises', function () {
    it('resolves wrapped functions with callbacks as last argument', function () {
        var wrappedFunction = promises.wrap(generateFunctionToWrap());
        return wrappedFunction(1, 2).then(function (result) {
            expect(result).to.deep.equal([1, 2]);
        });
    });

    it('rejects wrapped functions with callbacks as last argument', function () {
        var wrappedFunction = promises.wrap(generateFunctionToWrap('error'));
        return wrappedFunction(1, 2).catch(function (error) {
            expect(error).to.equal('error');
        });

    });

    function generateFunctionToWrap(error) {
        return function (arg1, arg2, callback) {
            if(error)
                callback(error);
            else
                callback(undefined, [arg1, arg2]);
        }
    }
});
