var columns = require('../../../src/data/sqlite/columns'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sqlite.columns', function () {
    it("returns empty array for unknown table", function () {
        return columns().for({}).then(function (result) {
            expect(result).to.deep.equal([]);
        });
    });

    it("returns columns set from item", function () {
        return columns().set({ name: 'columns' }, {
                number: 1,
                string: 'test',
                boolean: false,
                date: new Date()
            })
            .then(function () {
                return columns().for({ name: 'columns' });
            })
            .then(function (results) {
                expect(results).to.deep.equal([
                    { name: 'number', type: 'number' },
                    { name: 'string', type: 'string' },
                    { name: 'boolean', type: 'boolean' },
                    { name: 'date', type: 'date' },
                ]);
            });
    });
});
