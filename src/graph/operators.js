var util = require("util");

/**
 * @param opt
 * @constructor
 */
var Operator = function (opt) {
    opt = opt || {};
    this.id = opt.id;
};

Operator.prototype = {
    get_output_info: function (input_info) {
        return Promise.resolve(input_info);
    }
};


/**
 * @param {string|Array.<string>} names
 * @param opt
 * @constructor
 */
var FilterOperator = function (names, opt) {
    Operator.call(this, opt);
    this.names = Array.isArray(names) ? names : [names];
};
util.inherits(FilterOperator, Operator);

FilterOperator.prototype = {
    get_output_info: function (input_info) {
        this.names.forEach(function (name) {
            input_info.delete(name);
        });
        return Promise.resolve(input_info);
    }
};


module.exports = {
    Operator: Operator,
    FilterOperator: FilterOperator

};
