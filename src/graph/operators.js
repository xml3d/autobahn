var util = require("util");
var Field = require("./field.js");

/**
 * @param opt
 * @constructor
 */
var Operator = function (opt) {
    opt = opt || {};
    this.id = opt.id;
};

Operator.prototype = {
    /**
     * Compute the possible outputs from the provided inputs
     * without actually executing the operator.
     * The method runs asynchronously because a compüiler-based
     * analysis could take some time.
     * @param {Map} input_info
     * @returns {Promise}
     */
    get_output_info: function (input_info /*, node */) {
        return Promise.resolve(input_info);
    }
};




/**
 * Operator that filters some of the input fields
 * @param {string|Array.<string>} names The fields that are not passed ot the next graph node
 * @param opt
 * @constructor
 * @extends Operator
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




/**
 * Operator with a fixed (annotated) output signature
 * @param {string|Array.<{name: string, type: string}>} outputs
 * @param opt
 * @constructor
 * @extends Operator
 */
var AnnotatedOperator = function (outputs, opt) {
    Operator.call(this, opt);
    this.outputs = Array.isArray(outputs) ? outputs : [outputs];
};
util.inherits(AnnotatedOperator, Operator);

AnnotatedOperator.prototype = {
    get_output_info: function (input_info, node) {
        this.outputs.forEach(function (output) {
            input_info.set(output.name, {source: node, field: new Field({type: output.type}, null), derived: true });
        });
        return Promise.resolve(input_info);
    }
};

module.exports = {
    Operator: Operator,
    FilterOperator: FilterOperator,
    AnnotatedOperator: AnnotatedOperator

};
