function DataItem(data) {
  this.name = data.name;
  this.dots = data.dots;
}

function extractData(data) {
  flatdata = []
  for (key in data) {
    flatdata.push([key, data[key]])
  }
  return flatdata;
}

function nestedIndex(data, j) {
  newdata = []
  for (key in data) {
    newdata.push([j, data[key]]);
  }
  return newdata;
}

var colorkey = {0:"green", 1:"yellow", 2:"red"};

var radius = 50;
var rowheaders = ["good", "cool", "wow"];
var dataset = [{name: "Boeing", data: [1, 2, 0]},
               {name: "Airbus", data: [1, 1, 1]},
               {name: "Embraer", data: [2, 0, 0]}
              ];

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    padding = {top: 60, right: 60, bottom: 60, left: 60},
    outerWidth = 960,
    outerHeight = 800,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;

// var rScale = d3.scaleLinear()
//     .domain()

var svg = d3.select("#svg-container").append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", width / (dataset.length + 1) / 2)
    .attr("y", function(d, i) {
      return (20 + 10 + radius / 2) * (i + 1);
    })
    .text(function(d) {
      return d.name;
    })
    .attr("text-anchor", "middle");

svg.append("g")
    .selectAll("text")
    .data(rowheaders)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
      return width / (dataset.length + 1) * (i + 1) + radius / 2;
    })
    .attr("y", function(d, i) {
      return 20;
    })
    .text(function(d) {
      return d;
    })
    .attr("text-anchor", "middle");


svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("g")
    .selectAll("circle")
    .data(function(d, i) { return nestedIndex(d.data, i); })
    .enter()
    .append("circle")
    .attr("r", radius / 2 )
    .attr("cx", function(d, i) {
      return (width / (dataset.length + 1)) * (i + 1) + radius / 2
    })
    .attr("cy", function(d) {
      return (20 + 10 + radius / 2) * (d[0] + 1);
    })
    .attr("fill", function(d) {
      return colorkey[d[1]]
    });
