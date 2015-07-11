var Operator = require("./operators.js").Operator;

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
     * todo(ksons): Use promises
     * todo(ksons): Add request parameter
     * @return {Map<string, { source: Node, field: Field }>}
     */
    get_output_info: function () {
        var result = new Map();
        this.prev.forEach(function (prev) {
            var input = prev.get_output_info();
            var I = input.entries(), next;
            // no for of yet
            while (!(next = I.next()).done) {
                result.set(next.value[0], next.value[1]);
            }
        }, this);
        var I = this.fields.entries(), next;
        // no for of yet
        while (!(next = I.next()).done) {
            result.set(next.value[0], {source: this, field: next.value[1]});
        }
        return this.operator.get_output_info(result);
    }
};

module.exports = Node;
