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

        node.name && attributes.push(label(node.name));
        set_colors(1, attributes);

        nodes.push(name + "[" + attributes.join(",") + "]");
        nameMap.set(node, name);

        var I = node.fields.entries(), next;
        while (!(next = I.next()).done) {
            var inputName = name + "_" + safe_name(next.value[0]);
            nodes.push(inputName + "[" + label(next.value[0]) + "]");
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

function label(name) {
    return 'label="' + name + '"';
}

function set_colors(nr, attributes) {
    var color = COLORS[nr];
    if (color) {
        attributes.push('color="' + color.stroke + '"');
        attributes.push('fillcolor="' + color.fill + '"');
        attributes.push('fontcolor="' + color.font + '"');
        attributes.push('style="filled"');
    }
}

var COLORS = [
    {
        fill: "#9bbb59",
        stroke: "#71893f",
        font: "white"
    },
    {
        fill: "#4F81BD",
        stroke: "#385D8A",
        font: "white"
    },
    {
        fill: "#8064a2",
        stroke: "#5c4776",
        font: "white"
    },
    {
        fill: "#c0504d",
        stroke: "#632523",
        font: "white"
    },
    {
        fill: "#e3e3e3",
        stroke: "#000000",
        font: "black"
    },
    {
        fill: "#f79646",
        stroke: "#b66d31",
        font: "white"
    }
];
