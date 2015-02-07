var Pager = require('../index'),
    assert = require('assert'),
    _ = require('lodash');

suite('data-pager', function() {
    test('Constructor with known values (silly)', function() {
        var total = 10,
            perpage = 3,
            current = 1;
        var pager = new Pager(total, perpage, current);

        assert.equal(pager.total, total, 'total: value was set in constructor');
        assert.equal(pager.perpage, perpage, 'perpage: value was set in constructor');
        assert.equal(pager.last, 4);

        var cases = [
            {
                page: 1,
                firstEntry: 1,
                lastEntry: 3,
                entries: 3,
                skip: 0,
                previous: null,
                next: 2,
                nextPages: [2, 3, 4],
                previousPages: []
            },
            {
                page: 2,
                firstEntry: 4,
                lastEntry: 6,
                entries: 3,
                skip: 3,
                previous: 1,
                next: 3,
                nextPages: [3, 4],
                previousPages: [1]
            },
            {
                page: 3,
                firstEntry: 7,
                lastEntry: 9,
                entries: 3,
                skip: 6,
                previous: 2,
                next: 4,
                nextPages: [4],
                previousPages: [1, 2],
            },
            {
                page: 4,
                firstEntry: 10,
                lastEntry: 10,
                entries: 1,
                skip: 9,
                previous: 3,
                next: null,
                nextPages: [],
                previousPages: [1, 2, 3],
            },
        ];

        cases.forEach(function(testCase) {
            pager.page = testCase.page;

            assert.equal(pager.page, testCase.page);
            assert.equal(pager.first, 1);
            assert.equal(pager.last, 4);
            assert.equal(pager.firstEntry, testCase.firstEntry);
            assert.equal(pager.lastEntry, testCase.lastEntry);
            assert.equal(pager.previous, testCase.previous);
            assert.equal(pager.next, testCase.next);
            assert.equal(pager.skip, testCase.skip);
            assert.equal(pager.entriesOnPage, testCase.entries);
            assert.deepEqual(pager.nextPages(4), testCase.nextPages);
            assert.deepEqual(pager.previousPages(4), testCase.previousPages);
        });

    });

    test('Constructor with random data', function() {
        _.times(999, function() {
            var total = _.random(0, 999),
                perpage = _.random(1, 999),
                current = 1;

            var pager = new Pager(total, perpage, current),
                last = total / perpage;

            assert.equal(pager.total, total, 'total: value was set in constructor');
            assert.equal(pager.perpage, perpage, 'perpage: value was set in constructor');
            assert.equal(pager.first, 1);
            assert.equal(pager.last, Math.max(1, last % 1 === 0 ? last : parseInt(last) + 1));

            for (var i = 0; i < pager.last; i++) {
                pager.page = i + 1;

                var page = i + 1,
                    firstEntry = (i * perpage) + 1,
                    lastEntry = Math.min(pager.total, page * perpage),
                    entries = (page * perpage >= total) ? total % perpage : perpage;

                assert.equal(pager.page, page);
                assert.equal(pager.firstEntry, firstEntry);
                assert.equal(pager.lastEntry, lastEntry);
                assert.equal(pager.previous, i || null);
                assert.equal(pager.next, page < pager.last ? page + 1 : null);
                assert.equal(pager.skip, i * perpage);
                assert.equal(pager.entriesOnPage, entries);
            }
        });
    });


});
