// @TODO: YOUR CODE HERE!
//setup
var svgWidth = 720;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom:100,
  left: 50,
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

///setup SVG wrapper the append group to hold charts 
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//link data, and format data to num values
d3.csv("assets/data/data.csv").then(function(riskData) {
    riskData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.abbr = data.abbr;
      data.income = +data.income;
    // console.log(data);
  });

// Create scales for X and Y 
  const linearXScale = d3.scaleLinear()
    .domain(d3.extent(riskData, d => d.poverty))
    .range([0, width])
    .nice(); //crisp axes on intersection

  const linearYScale = d3.scaleLinear()
    .domain([6,d3.max(riskData, d => d.healthcare)])
    .range([height, 0])
    .nice();//crisp axes on intersection

 // create Axis
  const xAxis = d3.axisBottom(linearXScale);
  const yAxis = d3.axisLeft(linearYScale);
//append Axis to chartGroup
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
  chartGroup.append("g").call(yAxis);

// Make "cricles" scatter plots
chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("circle")
    .attr("cx", d=>linearXScale(d.poverty))
    .attr("cy", d=>linearYScale(d.healthcare))
    .attr("r", "10")
    .attr("stroke-width", "1")
    .classed("stateCircle", true)
    .attr("opacity", 0.99);

//add datapoints
chartGroup.append("g")
    .selectAll('text')
    .data(riskData)
    .enter()
    .append("text")
    .text(d=>d.abbr)
    .attr("x",d=>linearXScale(d.poverty))
    .attr("y",d=>linearYScale(d.healthcare))
    .classed(".stateText", true)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "10px")
    .style("font-weight", "bold")
    .attr("alignment-baseline", "central");



});
