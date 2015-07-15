var Operator = require("./operators.js").Operator;
var Promise = require('promise');

/**
 * @param opt
 * @constructor
 */
var Node = function (opt) {
    opt = opt || {};

    this.name = opt.name || "";

    /**
     * Nodes that consume the output of this node
     * @type {Array<Node>}
     */
    this.next = [];

    /**
     * Source nodes for this node
     * @type {Array<Node>}
     */
    this.prev = [];

    /**
     * Local input fields
     * @type {Map}
     */
    this.fields = new Map();

    /**
     * Operator that may modify the output of this node
     * @type {Operator}
     */
    this.operator = new Operator();
};

Node.prototype = {
    /**
     * Get all fields this node can output
     * todo(ksons): Add request parameter
     * @return {Map<string, { source: Node, field: Field }>}
     */
    get_output_info: function () {
        var that = this;
        return Promise.all(this.prev.map(function (p) {
            return p.get_output_info()
        })).then(merge).then(function (result) {
            var I = that.fields.entries(), next;
            // no for of yet
            while (!(next = I.next()).done) {
                result.set(next.value[0], {source: that, field: next.value[1]});
            }
            return that.operator.get_output_info(result);
        });
    }
};


function merge(outs) {
    var result = new Map();
    outs.forEach(function (input) {
        var I = input.entries(), next;
        // no for of yet
        while (!(next = I.next()).done) {
            result.set(next.value[0], next.value[1]);
        }
    }, this);
    return result;
}

module.exports = Node;
