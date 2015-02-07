/**
 * # data-pager.js
 *
 * Simple data pager based on [Data::Page](http://search.cpan.org/~lbrocard/Data-Page-2.02/lib/Data/Page.pm)
 *
 * @author Matthijs van Henten <matthijs@ischen.nl>
 * @version 0.0.1
 */

/**
 * Validation: checks wether value is an integer and sets the internal value
 *
 * @argument {String} name Name of the internal value
 * @argument {Number} value Value to set, must be an integer
 * @returns {Number} value Value that was set
 * @private
 */
var _validate = function(name, value) {
    if ((typeof value === 'number') && (value % 1 === 0)) {
        this._meta_[name] = value;
        return value;
    }
    throw new Error('Value is not an integer: ' + value);

};

/**
 * Create a new Pager object
 *
 * @argument {Number} Total entries in this set ( defaults to 100 )
 * @argument {Number} Current page for the set ( defaults to 1)
 * @argument {Number} Entries per page ( defaults to 10 )
 * @constructor
 */
var Pager = function(total, perpage, page) {
    Object.defineProperties(this, {
        _meta_: {
            value: {},
        },
    });

    this.total = total;
    this.perpage = perpage;
    this.page = page || 1;

    Object.freeze(this);
};

Pager.prototype = {
    /**
     * Sets or gets the total entries in this set
     *
     * @argument {Number} value Set total entries in this set
     * @returns {Number} value Total entries in this set
     */
    set total(value) {
        return _validate.call(this, 'total', value);
    },

    get total() {
        return this._meta_.total;
    },

    /**
     * @returns {Number} entries Total entries per page
     */
    get perpage() {
        return this._meta_.perpage;
    },

    /**
     * Sets or gets the items per page
     *
     * @argument {Number} entries Sets total entries per page
     * @returns {Number} entries New value entries per page
     */
    set perpage(value) {
        return _validate.call(this, 'perpage', value);
    },

    /**
     * @returns {Number} page Current page
     */
    get page() {
        return this._meta_.page;
    },

    /**
     * @argument {Number} value Sets the current page, cannot be higher then last
     * @returns {Number} page New value for current page
     */
    set page(value) {
        if (value <= this.last) {
            return _validate.call(this, 'page', value);
        }
    },

    /**
     * @returns {Number} entries Number of entries on this page
     */
    get entriesOnPage() {
        if (this.page === this.last) {
            return this.total % this.perpage;
        }

        return this.perpage;
    },

    /**
     * @returns {Number} first First page (always 1)
     */
    get first() {
        return 1;
    },

    /**
     * @returns {Number} last Last page
     */
    get last() {
        if (this.total === 0) return 1;

        var pages = this.total / this.perpage;

        if (pages % 1 === 0) return pages;

        return parseInt(pages, 10) + 1;
    },

    /**
     * @returns {Number} prev Previous page, or null if this is the first page
     */
    get previous() {
        return this.page - 1 || null;
    },

    /**
     * @returns {Number} next Next page, or null if this is the last page
     */
    get next() {
        if (this.page === this.last) {
            return null;
        }

        return this.page + 1;
    },

    /**
     * @returns {Number} skip Number of entries to skip from the database
     */
    get skip() {
        return (this.page - 1) * this.perpage;
    },

    /**
     * @returns {Number} entry Number of the first entry on the current page
     */
    get firstEntry() {
        return ((this.page - 1) * this.perpage) + 1;
    },

    /**
     * @returns {Number} entry Number of the last entry on the current page
     */
    get lastEntry() {
        if (this.page === this.last) {
            return this.total;
        }

        return (this.page * this.perpage);
    },

    /**
     * List n previous pages before this page
     *
     * @argument {Number} n Number of pages to list
     * @returns {Array} pages Array with page numbers
     */
    previousPages: function(n) {
        var page = this.page,
            pages = [];

        for (var i = 0; i < n && 1 <= page; i++) {
            page = page - 1;

            if (page < 1) {
                break;
            }

            pages.push(page);
        }

        return pages.reverse();
    },

    /**
     * List n previous pages after this page
     *
     * @argument {Number} n Number of pages to list
     * @returns {Array} pages Array with page numbers
     */
    nextPages: function(n) {
        var last = this.last,
            page = this.page,
            pages = [];

        for (var i = 0; i < n; i++) {
            page = page + 1;

            if (last < page) {
                break;
            }

            pages.push(page);
        }

        return pages;
    }
};

module.exports = Pager;
