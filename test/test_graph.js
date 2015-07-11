var assert = require("assert")

var Node = require("../src/graph/node.js");
var Graph = require("../src/graph/graph.js");
var PubSub = require('pubsub-js');

describe('Graph', function() {
    var graph;
    var nodes_created = 0;

    /*PubSub.subscribe("node.add", function() {
       console.log("created")
    });*/

     beforeEach(function() {
         graph = new Graph();
     });


    it('add_node add node to set', function () {
        assert.equal(0, graph._nodes.size)
        var node = new Node();
        var added = graph.add_node(node);
        assert.ok(added)
        assert.equal(1, graph._nodes.size)
        assert.ok(graph._nodes.has(node))

        added = graph.add_node(node);
        assert.ok(!added)

    });

    it('add_edge puts nodes into lists', function () {
        var n1 = new Node();
        var n2 = new Node();
        var n3 = new Node();

        graph.add_edge(n1, n2);
        assert.equal(2, graph._nodes.size);

        assert.notEqual(-1, n1.next.indexOf(n2));
        assert.notEqual(-1, n2.prev.indexOf(n1));
        assert.equal(-1, n1.prev.indexOf(n2));
        assert.equal(-1, n2.next.indexOf(n1));

        graph.add_edge(n2, n3);
        assert.equal(3, graph._nodes.size);
        assert.notEqual(-1, n2.next.indexOf(n3));
        assert.notEqual(-1, n3.prev.indexOf(n2));

        graph.add_edge(n2, n3);
        assert.equal(3, graph._nodes.size);

        assert.throws(function() {
            graph.add_edge(n2, n2);
        });
    });

    it('remove_edge removes from/to nodes', function () {
        var n1 = new Node();
        var n2 = new Node();
        var n3 = new Node();

        graph.add_edge(n1, n2);
        graph.add_edge(n2, n3);

        assert.equal(3, graph._nodes.size);

        var removed = graph.remove_edge(n2, n3);
        assert.ok(removed);
        assert.equal(-1, n2.next.indexOf(n3));
        assert.equal(-1, n3.prev.indexOf(n2));
        assert.equal(3, graph._nodes.size);

        removed = graph.remove_edge(n2, n3);
        assert.ok(!removed);
    });

    it('remove_node removes also dependencies', function () {
        var n1 = new Node();
        var n2 = new Node();
        var n3 = new Node();

        graph.add_edge(n1, n2);
        graph.add_edge(n2, n3);

        assert.equal(3, graph._nodes.size);
        graph.remove_node(n2);
        assert.equal(2, graph._nodes.size);

        assert.equal(-1, n1.next.indexOf(n2));
        assert.equal(-1, n2.next.indexOf(n3));
        assert.equal(-1, n3.prev.indexOf(n2));
        assert.equal(-1, n2.prev.indexOf(n1));

    });


});
