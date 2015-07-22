#!/usr/bin/env node

var argv = require('optimist').argv,
    usage = "node ./json2dot.js graph.json";

var deserialize = require("../src/serialize/deserialize.js");
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
    d3(deserialize(json)).then(function(d3str) {
        console.log(JSON.stringify(d3str, null, ""));
    });

    //console.log(d3str);

}(argv));
