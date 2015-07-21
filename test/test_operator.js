var assert = require("assert");

var Node = require("../src/graph/node.js");
var Field = require("../src/graph/field.js");
var Graph = require("../src/graph/graph.js");
var Operators = require("../src/graph/operators.js");

describe('Operator', function () {
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

    it('filter', function (done) {

        n2.operator = new Operators.FilterOperator("n2-field");

        graph.add_edge(n2, n1);
        graph.add_edge(n3, n2);

        graph.set_field(n1, "n1-field", s1);
        graph.set_field(n2, "n2-field", s2);
        graph.set_field(n3, "n3-field", s3);


        n1.get_output_info().then(function (output) {
            assert.equal(2, output.size);
            assert.ok(output.has("n1-field"));
            assert.ok(!output.has("n2-field"));
            assert.ok(output.has("n3-field"));

            assert.strictEqual(n1, output.get("n1-field").source);
            assert.strictEqual(n3, output.get("n3-field").source);
            assert.strictEqual(s1, output.get("n1-field").field);
            assert.strictEqual(s3, output.get("n3-field").field);
            done();
        }).catch(function (err) {
            done(err);
        });

    });

    it('asychronus operator', function (done) {

        n2.operator = {
            get_output_info: function (input_info) {
                return new Promise(function (resolve) {
                    setTimeout(
                        function () {
                            input_info.delete("n2-field");
                            resolve(input_info);
                        }, 1000);
                });
            }
        };

        graph.add_edge(n2, n1);
        graph.add_edge(n3, n2);

        graph.set_field(n1, "n1-field", s1);
        graph.set_field(n2, "n2-field", s2);
        graph.set_field(n3, "n3-field", s3);


        n1.get_output_info().then(function (output) {
            assert.equal(2, output.size);
            assert.ok(output.has("n1-field"));
            assert.ok(!output.has("n2-field"));
            assert.ok(output.has("n3-field"));

            assert.strictEqual(n1, output.get("n1-field").source);
            assert.strictEqual(n3, output.get("n3-field").source);
            assert.strictEqual(s1, output.get("n1-field").field);
            assert.strictEqual(s3, output.get("n3-field").field);
            done();
        }).catch(function (err) {
            done(err);
        });

    });
});
