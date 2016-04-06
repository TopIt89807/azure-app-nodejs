var columns = require('../../../src/data/sqlite/columns'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sqlite.columns', function () {
    describe('for', function () {
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
                        { name: 'id', type: 'string' },
                        { name: 'createdAt', type: 'date' },
                        { name: 'updatedAt', type: 'date' },
                        { name: 'version', type: 'string' },
                        { name: 'deleted', type: 'boolean' }
                    ]);
                });
        });
    });

    describe('fromItem', function () {
        it("constructs array of columns from item", function () {
            expect(columns().fromItem({ string: '', number: 1, boolean: false, date: new Date() }))
                .to.deep.equal([
                    { name: 'string', type: 'string' },
                    { name: 'number', type: 'number' },
                    { name: 'boolean', type: 'boolean' },
                    { name: 'date', type: 'date' },
                    { name: 'id', type: 'string' },
                    { name: 'createdAt', type: 'date' },
                    { name: 'updatedAt', type: 'date' },
                    { name: 'version', type: 'string' },
                    { name: 'deleted', type: 'boolean' }
                ]);
        });

        it("constructs array of columns from predefined columns and item", function () {
            expect(columns().fromItem(
                { string: '', number: 1, boolean: false, date: new Date() },
                { columns: { 'p1': 'string', 'string': 'string', 'number': 'string' } }
            )).to.deep.equal([
                { name: 'string', type: 'string' },
                { name: 'number', type: 'string' },
                { name: 'boolean', type: 'boolean' },
                { name: 'date', type: 'date' },
                { name: 'p1', type: 'string' },
                { name: 'id', type: 'string' },
                { name: 'createdAt', type: 'date' },
                { name: 'updatedAt', type: 'date' },
                { name: 'version', type: 'string' },
                { name: 'deleted', type: 'boolean' }
            ]);
        });

        it("constructs array of columns from predefined columns, item and existingColumns", function () {
            expect(columns().fromItem(
                { string: '', number: 1, boolean: false, date: new Date() },
                { columns: { 'p1': 'string', 'string': 'string', 'number': 'string' } },
                [
                    { name: 'p1', type: 'string' },
                    { name: 'id', type: 'string' },
                    { name: 'createdAt', type: 'date' },
                    { name: 'updatedAt', type: 'date' },
                    { name: 'version', type: 'string' },
                    { name: 'deleted', type: 'boolean' }
                ]
            )).to.deep.equal([
                { name: 'p1', type: 'string' },
                { name: 'id', type: 'string' },
                { name: 'createdAt', type: 'date' },
                { name: 'updatedAt', type: 'date' },
                { name: 'version', type: 'string' },
                { name: 'deleted', type: 'boolean' },
                { name: 'string', type: 'string' },
                { name: 'number', type: 'string' },
                { name: 'boolean', type: 'boolean' },
                { name: 'date', type: 'date' }
            ]);
        });
    });

    describe('applyTo', function () {
        it("applies column types to items", function () {
            return columns().set({ name: 'columns' }, {
                    number: 1,
                    string: 'test',
                    boolean: false,
                    date: new Date()
                })
                .then(function () {
                    return columns().applyTo({ name: 'columns' }, [
                        { number: 2, string: 'test2', boolean: 1, date: '2016-03-31T17:00:00.000Z' },
                        { number: 3, string: 'test3', boolean: 0, date: '2017-04-01T17:01:00.000Z' }
                    ]);
                })
                .then(function (results) {
                    expect(results).to.deep.equal([
                        { number: 2, string: 'test2', boolean: true, date: new Date('2016-03-31T17:00:00.000Z') },
                        { number: 3, string: 'test3', boolean: false, date: new Date('2017-04-01T17:01:00.000Z') }
                    ]);
                });
        });
    });
});
