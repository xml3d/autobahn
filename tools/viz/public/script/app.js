console.log("Starting Fastlane Visualization");


d3.json("graph.json", function(graph) {

var margin = {top: 1, right: 1, bottom: 6, left: 25},
    width = 1024 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20();

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(25)
    .nodePadding(10)
    .size([width, height]);

var path = sankey.link();

  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy * 0.3); })
      .style("stroke", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      .sort(function(a, b) { return b.dy - a.dy; });

  link.append("title")
      .text(function(d) { return d.name });


  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

  node.append("rect")
      .attr("height", function(d) { return Math.max(d.dy, 50); })
      .attr("width", sankey.nodeWidth())
      .attr("ry", 5).attr("rx", 5)
      //.style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
      //.style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + (d.operator ? "\n" + d.operator : "") });

  node.append("text").attr("x", sankey.nodeWidth() / 2)
      .attr("y", function(d) { return 12 ; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", null).filter(function(d) { return !!d.operator; }).attr("class", "fa fa-cog").text("");


  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy ; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
});
