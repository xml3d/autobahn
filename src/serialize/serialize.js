var serialize = function (graph) {
    var result = {
        nodes: [],
        edges: []
    };

    var positionMap = new Map();

    graph._nodes.forEach(function (node) {
        var n = {name: node.name, fields: []};
        var I = node.fields.entries(), next;
        // no for of yet
        while (!(next = I.next()).done) {
            n.fields.push({name: next.value[0], value: next.value[1]});
        }
        var pos = result.nodes.length;
        positionMap.set(node, pos);
        result.nodes.push(n);
    });

    graph._nodes.forEach(function (node) {
        var from = positionMap.get(node);
        node.next.forEach(function (next) {
            var to = positionMap.get(next);
            result.edges.push([from, to]);
        });
    });

    return result;
};


module.exports = serialize;
