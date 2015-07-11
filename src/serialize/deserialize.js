var Node = require("../graph/node.js");
var Field = require("../graph/field.js");
var Graph = require("../graph/graph.js");

var assert = require("assert");

module.exports = function (json) {
    assert(json && typeof json == "object");

    var result = new Graph();
    var positionMap = new Map();

    json.nodes.forEach(function (n, idx) {
        var node = new Node({name: n.name});
        positionMap.set(idx, node);
        n.fields.forEach(function(f) {
            result.set_field(node, f.name, new Field(f.value.info, f.value.value));
        })
    });

    json.edges.forEach(function (e) {
        var n1 = positionMap.get(e[0]);
        var n2 = positionMap.get(e[1]);
        assert(n1 && n2);
        result.add_edge(n1, n2);
    });

    return result;
};
