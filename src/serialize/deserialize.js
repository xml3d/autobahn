var Node = require("../graph/node.js");
var Field = require("../graph/field.js");
var Graph = require("../graph/graph.js");

var assert = require("assert");

module.exports = function (json, operatorMap) {
    assert(json && typeof json == "object");
    assert(!operatorMap || operatorMap instanceof Map);

    operatorMap = operatorMap || new Map();
    var result = new Graph();
    var positionMap = new Map();

    json.nodes.forEach(function (n, idx) {
        var node = new Node({name: n.name});
        positionMap.set(idx, node);
        Object.keys(n.fields).forEach(function(name) {
            var field = n.fields[name];
            result.set_field(node, name, new Field(field.info, field.value));
        });
        if(n.operator) {
            if(!operatorMap.has(n.operator)) {
                console.error("operator not found:", n.operator);
            } else {
                node.operator = new operatorMap.get(n.operator)();
            }
        }
    });

    json.edges.forEach(function (e) {
        var n1 = positionMap.get(e[0]);
        var n2 = positionMap.get(e[1]);
        assert(n1 && n2);
        result.add_edge(n1, n2);
    });

    return result;
};
