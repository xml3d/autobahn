/**
 * @constructor
 */
var Operator = function (opt) {
    opt = opt || {};
    this.id = opt.id || "noname";
};

Operator.prototype = {
    get_output_info: function(input_info) {
        return input_info;
    }
};

module.exports = {
    Operator: Operator

};
