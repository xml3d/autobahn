var assert = require("assert")

var Node = require("../src/graph/node.js");
var Field = require("../src/graph/field.js");
var Graph = require("../src/graph/graph.js");
var serialize = require("../src/serialize/serialize.js");
var deserialize = require("../src/serialize/deserialize.js");
var dot = require("../src/serialize/dot.js");

var PubSub = require('pubsub-js');

describe('Node', function () {
    var graph, n1, n2, n3, s1, s2, s3;

    beforeEach(function () {
        graph = new Graph();
        n1 = new Node({name: "node 1"});
        n2 = new Node({name: "node 2"});
        n3 = new Node({name: "node 3"});
        s1 = new Field({}, 5);
        s2 = new Field({}, 6);
        s3 = new Field({}, 7);
        graph.add_node(n1);

    });

    describe('fields', function () {
        it('graph::set_field sets fields', function () {
            graph.set_field(n1, "position", s1);
            graph.set_field(n1, "normal", s2);

            assert.equal(2, n1.fields.size);
            var a1 = n1.fields.get("position");
            var a2 = n1.fields.get("normal");

            assert.strictEqual(a1, s1);
            assert.strictEqual(a2, s2);
        });

        it('get_output_info has node fields', function () {
            graph.set_field(n1, "position", s1);
            graph.set_field(n1, "normal", s2);

            var output = n1.get_output_info();
            assert.equal(2, output.size);
            assert.ok(output.has("normal"));
            assert.ok(output.has("position"));

            assert.strictEqual(n1, output.get("position").source);
            assert.strictEqual(n1, output.get("normal").source);
            assert.strictEqual(s2, output.get("normal").field);
            assert.strictEqual(s1, output.get("position").field);
        });

        it('get_output_info has previous node fields', function () {
            graph.add_edge(n2, n1);

            graph.set_field(n1, "n1-field", s1);
            graph.set_field(n2, "n2-field", s2);

            var output = n1.get_output_info();
            assert.equal(2, output.size);
            assert.ok(output.has("n1-field"));
            assert.ok(output.has("n2-field"));

            assert.strictEqual(n1, output.get("n1-field").source);
            assert.strictEqual(n2, output.get("n2-field").source);
            assert.strictEqual(s1, output.get("n1-field").field);
            assert.strictEqual(s2, output.get("n2-field").field);
        });

        it('get_output_info has previous node fields (recursively)', function () {
            graph.add_edge(n2, n1);
            graph.add_edge(n3, n2);

            graph.set_field(n1, "n1-field", s1);
            graph.set_field(n2, "n2-field", s2);
            graph.set_field(n3, "n3-field", s3);

            var output = n1.get_output_info();
            assert.equal(3, output.size);
            assert.ok(output.has("n1-field"));
            assert.ok(output.has("n2-field"));
            assert.ok(output.has("n3-field"));

            assert.strictEqual(n1, output.get("n1-field").source);
            assert.strictEqual(n2, output.get("n2-field").source);
            assert.strictEqual(n3, output.get("n3-field").source);
            assert.strictEqual(s1, output.get("n1-field").field);
            assert.strictEqual(s2, output.get("n2-field").field);
            assert.strictEqual(s3, output.get("n3-field").field);

            // var json = dot(deserialize(serialize(graph)));
            // console.log(json);
            // deserialize(json);
        });

        it('get_output_info local fields overwrite fields from previous nodes', function () {
            graph.add_edge(n2, n1);

            graph.set_field(n1, "n1-field", s1);
            graph.set_field(n2, "n1-field", s2);

            var output = n1.get_output_info();
            assert.equal(1, output.size);
            assert.ok(output.has("n1-field"));

            assert.strictEqual(n1, output.get("n1-field").source);
            assert.strictEqual(s1, output.get("n1-field").field);
        });

        it('get_output_info local fields overwrite fields from previous nodes (recursively)', function () {
            graph.add_edge(n2, n1);
            graph.add_edge(n3, n2);

            graph.set_field(n1, "n1-field", s1);
            graph.set_field(n2, "n1-field", s2);
            graph.set_field(n3, "n1-field", s3);

            var output = n1.get_output_info();
            assert.equal(1, output.size);
            assert.ok(output.has("n1-field"));

            assert.strictEqual(n1, output.get("n1-field").source);
            assert.strictEqual(s1, output.get("n1-field").field);
        });


    });


});

