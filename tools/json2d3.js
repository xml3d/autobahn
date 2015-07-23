#!/usr/bin/env node

var argv = require('optimist').argv,
    usage = "node ./json2dot.js graph.json";

var deserialize = require("../src/serialize/deserialize.js");
var Operators = require("../src/graph/operators.js");
var d3 = require("../src/serialize/d3.js");

(function (args) {

    var fs = require("fs"),
        path = require("path"),
        filename = args._[0];


    if (!filename) {
        console.log(usage);
        process.exit(0);
    }

    var data = fs.readFileSync(filename, "utf-8");
    var json = JSON.parse(data);

    var operatorMap = new Map();
    operatorMap.set("xflow.mywave", new Operators.AnnotatedOperator([
            {type: 'float3', name: 'position'},
            {type: 'float3', name: 'normal'}],
        {id: "xflow.mywave"}));

    operatorMap.set("xflow.mygrid", new Operators.AnnotatedOperator([
            {type: 'float3', name: 'position', customAlloc: true},
            {type: 'float3', name: 'normal', customAlloc: true},
            {type: 'float2', name: 'texcoord', customAlloc: true},
            {type: 'int', name: 'index', customAlloc: true}],
        {id: "xflow.mygrid"}));

    d3(deserialize(json, operatorMap)).then(function (d3str) {
        console.log(JSON.stringify(d3str, null, ""));
    });

    //console.log(d3str);

}(argv));
