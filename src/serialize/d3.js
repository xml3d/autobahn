var serialize = function (graph) {
    return new Promise(function (resolve) {

        var d3 = {
            nodes: [],
            links: []
        };

        var positionMap = new Map();

        graph._nodes.forEach(function (node) {
            var n = {name: node.name};
            var idx = d3.nodes.length;
            positionMap.set(node, idx);
            d3.nodes.push(n);
        });


        var nodes = map(graph._nodes, function(n) { return n; });
        Promise.all(map(graph._nodes, function (n) {
            return n.get_output_info();
        })).then(function (allOutputs) {
            allOutputs.forEach(function(output, idx) {
                var node = nodes[idx];
                node.next.forEach(function(next) {
                    output.forEach(function (value, key) {
                        d3.links.push({
                            name: key, target: positionMap.get(next), source: positionMap.get(node), value: 2
                        });
                });

            }   );
            });
            resolve(d3);
        });





        /*var target = graph._nodes.entries().next().value[0];
        var targetPosition = positionMap.get(target);
            console.log("Here", target.name)

        target.get_output_info().then(function (outputMap) {
            outputMap.forEach(function (value, key) {
                if (positionMap.get(value.source) != targetPosition) {//console.log("here", positionMap.get(value.source));
                    d3.links.push({
                        name: key, target: targetPosition, source: positionMap.get(value.source), value: 2
                    });
                }
            });
            resolve(d3)
        });*/


    });
};


function map(set, f) {
    var arr = [];
    var I = set.entries(), next;
    while (!(next = I.next()).done) {
        arr.push(f(next.value[0]));
    }
    return arr;
}

module.exports = serialize;
