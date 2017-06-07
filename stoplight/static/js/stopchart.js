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

var circleStyle = {stroke: "black", strokeWidth: "3px", radius: 50}
var default_colheaders = ["good", "cool", "wow"];
var default_data = [
  {name: "cat", data: [1, 2, 0]},
  {name: "dog", data: [1, 1, 1]},
  {name: "lizard", data: [2, 0, 0]},
  {name: "fish", data: [1, 1, 1]},
  {name: "giraffe", data: [1, 2, 1]}
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

function updateChart() {
  update(default_colheaders, default_data, circleStyle);
}

d3.select("#addrow-button")
  .on("click", function() {
    var newData = []
    for (var i=0; i<default_data[0].data.length; i++) {
      newData.push(0)
    }
    var row = {name: "marmot", data: newData};
    default_data.push(row);
    updateChart();
  })

d3.select("#addcol-button")
    .on("click", function() {
      colName = "super"
      default_colheaders.push(colName);
      for (var i=0; i<default_data.length; i++) {
        default_data[i].data.push(0);
      }
      updateChart();
    })

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

updateChart();

function update(headers, rowdata, styleData) {
  dataset = rowdata;
  colheaders = headers;
  chartStyle = styleData;
  // console.log(dataset);

  var t = d3.transition()
      .ease(d3.easeQuadIn)
      .duration(300);

  var svgRowHeaders = svg.selectAll(".svg-row-header")
      .data(dataset, function(d) {return d.name;});

  svgRowHeaders.exit()
      .transition(t)
      .attr("x", 1000)
      .remove();

  svgRowHeaders.on("click", function(d, i) {
          var newdata = dataset.splice(i, 1);
          updateChart();
      })
      .transition(t)
      .attr("x", function(d) {
        return width / (d.data.length + 1) / 2;
      })
      .attr("y", function(d, i) {
        return (20 + 10 + chartStyle.radius / 2) * (i + 1);
      })
      .text(function(d) {
        return d.name;
      })


  svgRowHeaders.enter()
      .append("text")
      .on("click", function(d, i) {
          var newdata = dataset.splice(i, 1);
          updateChart();
      })
      .attr("class", "svg-row-header")
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        return width / (d.data.length + 1) / 2;
      })
      .attr("y", function(d,i) {
        return height + chartStyle.radius * i;
      })
      .transition(t)
      .attr("y", function(d, i) {
        return (20 + 10 + chartStyle.radius / 2) * (i + 1);
      })
      .text(function(d) {
        return d.name;
      });

  var svgColHeaders = svg.selectAll(".svg-col-header")
      .data(colheaders);

  svgColHeaders.exit()
      .transition(t)
      .remove()

  svgColHeaders.transition(t)
      .attr("x", function(d, i) {
        return width / (dataset[0].data.length + 1) * (i + 1) + chartStyle.radius / 2;
      })
      .attr("y", function(d, i) {
        return 20;
      })
      .text(function(d) {
        return d;
      })
      .attr("text-anchor", "middle");

  svgColHeaders.enter()
      .append("text")
      .attr("class", "svg-col-header")
      .attr("x", function(d, i) {
        return width / (dataset[0].data.length + 1) * (i + 1) + chartStyle.radius / 2;
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
      .attr("cx", 1000)
      .remove();

  svgCircles.transition(t)
      .attr("r", chartStyle.radius / 2 )
      .attr("cx", function(d) {
        return (width / (dataset[0].data.length + 1)) * (d.x + 1) + chartStyle.radius / 2
      })
      .attr("cy", function(d) {
        return (20 + 10 + chartStyle.radius / 2) * (d.y + 1);
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
          updateChart();
      })
      .attr("r", chartStyle.radius / 2 )
      .attr("cx", function(d) {
        return (width / (dataset[0].data.length + 1)) * (d.x + 1) + chartStyle.radius / 2
      })
      .attr("cy", function(d) {
        return height + chartStyle.radius * d.y;
      })
      .transition(t)
      .attr("cy", function(d) {
        return (20 + 10 + chartStyle.radius / 2) * (d.y + 1);
      })
      .attr("fill", function(d) {
        return colorkey[d.colorkey];
      })
      .attr("stroke", chartStyle.stroke)
      .attr("stroke-width", chartStyle.strokeWidth)

  default_data = dataset;
  default_colheaders = colheaders;
  styleData = circleStyle;
}
