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

function flatten(data) {
  var newdata = [];
  for (var i=0; i < data.length; i++) {
    var nest = nestedIndex(data[i].data, i, data[i].name);
    newdata = newdata.concat(nest);
  }
  return newdata;
}

function nestedIndex(data, j, name) {
  newdata = []
  for (var i=0; i<data.length; i++) {
    newdata.push({x: i, y: j, colorkey: data[i], name: name});
  }
  return newdata;
}

var colorkey = ["green", "yellow", "red"];

var radius = 50;
var default_rowheaders = ["good", "cool", "wow"];
var default_data = [{name: "Boeing", data: [1, 2, 0]},
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
//
// svg.append("g")
//     .attr("id", "svg-row-headers");
//
// svg.append("g")
//     .attr("id", "svg-circles");
//
// svg.append("g")
//     .attr("id", "svg-col-headers");

update(default_rowheaders, default_data);

function update(headers, rowdata) {
  dataset = rowdata;
  colheaders = headers;

  var t = d3.transition()
      .ease(d3.easeQuadIn)
      .duration(500);

  var svgRowHeaders = svg.selectAll(".svg-row-header")
      .data(dataset);

  svgRowHeaders.exit()
      .transition(t)
      .remove()

  svgRowHeaders.transition(t)

  svgRowHeaders.enter()
      .append("text")
      .attr("class", "svg-row-header")
      .attr("x", width / (dataset.length + 1) / 2)
      .attr("y", function(d,i) {
        return height + radius * i;
      })
      .transition(t)
      .attr("y", function(d, i) {
        return (20 + 10 + radius / 2) * (i + 1);
      })
      .text(function(d) {
        return d.name;
      })
      .attr("text-anchor", "middle");

  var svgColHeaders = svg.selectAll(".svg-col-header")
      .data(colheaders);

  svgColHeaders.exit()
      .transition(t)
      .remove()

  svgColHeaders.transition(t)

  svgColHeaders.enter()
      .append("text")
      .attr("class", "svg-col-header")
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


  var svgCircles = svg.selectAll("circle")
      .data(flatten(dataset));

  svgCircles.exit()
      .transition(t)
      .remove();

  svgCircles.transition(t)
      .attr("r", radius / 2 )
      .attr("cx", function(d) {
        return (width / (dataset.length + 1)) * (d.x + 1) + radius / 2
      })
      .attr("cy", function(d) {
        return (20 + 10 + radius / 2) * (d.y + 1);
      })
      .attr("fill", function(d) {
        return colorkey[d.colorkey];
      });

  svgCircles.enter()
      .append("circle")
      .on("click", function(d) {
          var newcolor = d.colorkey + 1;
          if (newcolor >= colorkey.length) {
              newcolor = 0;
          };
          dataset[d.y].data[d.x] = newcolor;
          update(colheaders, dataset);
      })
      .attr("r", radius / 2 )
      .attr("cx", function(d) {
        return (width / (dataset.length + 1)) * (d.x + 1) + radius / 2
      })
      .attr("cy", function(d) {
        return height + radius * d.y;
      })
      .transition(t)
      .attr("cy", function(d) {
        return (20 + 10 + radius / 2) * (d.y + 1);
      })
      .attr("fill", function(d) {
        return colorkey[d.colorkey];
      });
}
