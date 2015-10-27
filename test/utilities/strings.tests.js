var expect = require('chai').expect,
    strings = require('../../src/utilities/strings');

describe('azure-mobile-apps.utilities.strings', function () {
    describe('getVersiomFromIfMatch', function () {
        it('removes starting and finishing double quotes and remove escaping from quotes in the middle', function () {
            expect(strings.getVersiomFromIfMatch('"test \"inside\" test"')).to.equal('test "inside" test');
        })
    })
});
