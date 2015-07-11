module.exports = function (graph) {
    var lines = [];
    var nodes = [];
    var edges = [];
    var options = {
        graph: {
            rankdir: "LR",
            ordering: "out",
            fontsize: 14,
            fontname: "Helvetica",
            bgcolor: "transparent"
        },
        node: {
            shape: "box",
            fontsize: 14,
            fontname: "Helvetica"
        }
    };

    var nameMap = new Map();

    lines.push("digraph g {");
    for (var name in options) {
        lines.push(options2String(options, name));
    }

    var i = 0;
    graph._nodes.forEach(function (node) {
        var attributes = [];
        var name = "N" + i++;

        node.name && attributes.push('label="' + node.name + '"');

        nodes.push(name +  "[" + attributes.join(",") + "]");
        nameMap.set(node, name);

        var I = node.fields.entries(), next;
        while (!(next = I.next()).done) {
            var inputName = name + "_" + safe_name(next.value[0]);
            nodes.push(inputName);
            edges.push(inputName + " -> " + name);
         }
    });

    graph._nodes.forEach(function (node) {
        var from = nameMap.get(node);
        node.next.forEach(function (next) {
            var to = nameMap.get(next);
            edges.push(from + " -> " + to);
        });
    });
    lines = lines.concat(nodes, edges);

    lines.push("}"); // end diagraph
    return lines.join("\n");
};


function options2String(opt, name) {
    var tmp = []
    opt = opt[name] || opt;
    for (var option in opt) {
        tmp.push(option + "=" + opt[option]);
    }
    return name + " [" + tmp.join(",") + "];";
}

function safe_name(name) {
    return name.replace("-", "_");
}
