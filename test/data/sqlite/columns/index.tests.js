var columns = require('../../../../src/data/sqlite/columns'),
    sqlite3 = require('sqlite3'),
    expect = require('chai').expect;

describe('azure-mobile-apps.data.sqlite.columns', function () {
    var tableColumns = [
        { name: 'number', type: 'number' },
        { name: 'string', type: 'string' },
        { name: 'boolean', type: 'boolean' },
        { name: 'date', type: 'date' }
    ];

    describe('for', function () {
        it("returns empty array for unknown table", function () {
            return columns(new sqlite3.Database(':memory:')).for({}).then(function (result) {
                expect(result).to.deep.equal([]);
            });
        });

        it("returns set columns", function () {
            var connection = new sqlite3.Database(':memory:');
            return columns(connection).set({ name: 'columns1' }, tableColumns)
                .then(function () {
                    return columns(connection).set({ name: 'columns2' }, tableColumns)
                })
                .then(function () {
                    return columns(connection).for({ name: 'columns1' });
                })
                .then(function (results) {
                    expect(results).to.deep.equal(tableColumns);
                });
        });

        it("returns cached columns", function () {
            return columns(new sqlite3.Database(':memory:')).set({ name: 'columns' }, tableColumns)
                .then(function () {
                    return columns().for({ name: 'columns', sqliteColumns: [ { name: 'string', type: 'string '}] });
                })
                .then(function (results) {
                    expect(results).to.deep.equal([ { name: 'string', type: 'string '}]);
                });
        })
    });

    describe('applyTo', function () {
        it("applies column types to items", function () {
            var connection = new sqlite3.Database(':memory:');
            
            return columns(connection).set({ name: 'columns' }, tableColumns)
                .then(function () {
                    return columns(connection).applyTo({ name: 'columns' }, [
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
