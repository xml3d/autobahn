var assert = require("assert");
var Node = require("./node.js");
var PubSub = require('pubsub-js');

var Graph = function () {
    this._nodes = new Set();
};

Graph.prototype = {
    /**
     * @param {Node} from
     * @param {Node} to
     */
    add_edge: function (from, to) {
        assert(from instanceof Node);
        assert(to instanceof Node);
        assert(to !== from);

        this.add_node(from);
        this.add_node(to);
        from.next.push(to);
        to.prev.push(from);
    },

    /**
     * @param {Node} from
     * @param {Node} to
     */
    remove_edge: function (from, to) {
        assert(from instanceof Node);
        assert(to instanceof Node);

        var r1 = remove_array_item(from.next, to);
        var r2 = remove_array_item(to.prev, from);

        // Either edge exists in both or in none
        assert(r1 == r2);
        return r1;
    },

    /**
     * @param {Node} node node to add
     * @returns {boolean} false if node was already in graph, true otherwise
     */
    add_node: function (node) {
        assert(node instanceof Node);

        if (this._nodes.has(node)) {
            return false;
        }
        this._nodes.add(node);
        PubSub.publish("node.add", {node: node, graph: this});
        return true;
    },

    remove_node: function (node) {
        assert(node instanceof Node);

        if (!this._nodes.has(node)) {
            return false;
        }

        node.next.forEach(function(next) {
           this.remove_edge(node, next);
        }, this);

        node.prev.forEach(function(prev) {
           this.remove_edge(prev, node);
        }, this);

        this._nodes.delete(node);
        PubSub.publish("node.delete", {node: node, graph: this});
        return true;
    },

    set_field: function(node, name, field) {
        if(node.fields.has(name)) {

        } else {

        }
        node.fields.set(name, field);
    }


};

function remove_array_item(arr, item) {
    var idx = arr.indexOf(item);
    if(idx == -1) {
        return false;
    }
    arr.splice(idx, 1);
    return true;
}

module.exports = Graph;
