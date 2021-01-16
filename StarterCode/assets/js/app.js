// @TODO: YOUR CODE HERE!
//setup
function makeResponsive() {
var svgWidth = 720;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left:100
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
      data.obesity = +data.obesity;
    // console.log(data);
  });

// Create scales for X and Y 
  const linearXScale = d3.scaleLinear()
    .domain([8.5, d3.max(riskData, d => d.poverty)])
    .range([0, width]);
    

  const linearYScale = d3.scaleLinear()
    .domain([3.5, d3.max(riskData, d => d.healthcare)])
    .range([height, 0]);
   

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

//add titles
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 13})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "black")
    .style("font-weight", "Bold")
    .text("Poverty");

 chartGroup.append("text")
    .attr("y", 0 - ((margin.left / 2) + 2))
    .attr("x", 0 - (height / 2))
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "black")
    .style("font-weight", "Bold")
    .attr("transform", "rotate(-90)")
    .text("Health Care (%)");
  })
  
    .catch(function(error) {
  //console.log(error);


});
}

makeResponsive();

///=====================ATTEMPTING BONUS ===============
// @TODO: YOUR CODE HERE!
//setup

  var svgWidth = 720;
  var svgHeight = 500;
  const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left:100
    };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;
  
  ///setup SVG wrapper the append group to hold charts 
  const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
    //default selection
    var chosenXaxis = "poverty";
    var chosenYaxis = "healthcare";

//create a function using xAxis const to update data  when clicked
function renderXAxes(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
//create a function using xAxis const to update data  when clicked

function renderYAxes(newYScale, yAxis) {
  const leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

//update circles and text group with a transition

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=>newYScale(d[chosenYAxis]));
  return circlesGroup;
}
//text
function renderTexts(txtGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  txtGroup.transition()
    .duration(1000)
    .attr("x", d=>newXScale(d[chosenXAxis]))
    .attr("y", d=>newYScale(d[chosenYAxis]))
  return txtGroup;
}

//use function to ccreate and update x and y scales 
//X
function xScale(healthData, chosenXaxis) {
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXaxis]*0.8),
      d3.max(healthData, d => d[chosenXaxis]*1.2)
    ])
    .range([0, width]);
  return xLinearScale;
}
//Y
function yScale(healthData, chosenYaxis) {
  const yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d=>d[chosenYaxis])*0.8, d3.max(healthData, d=>d[chosenYaxis])*1.2 ])
    .range([height, 0]);
  return yLinearScale;
}

//tooltip function for circles and label

function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup){
  let xLabel = ""
  let yLabel = ""
  if (chosenXaxis === "poverty"){
    xLabel = "Poverty: ";
  }
  else if (chosenXaxis === "age"){
    xLabel = "Age: ";
  }
  else{
    xLabel = "Income: $";
  }
  if (chosenYaxis === "healthcare"){
    yLabel = "Healthcare: "
  }
  else if (chosenYaxis === "smokes"){
    yLabel = "Smokes: "
  }
  else{
    yLabel = "Obesity: "
  }
  //console.log(toolTipProperty);
const toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([80, -60])
                    .html(function(d){
                      if (chosenYaxis === "smokes" || chosenYaxis === "obesity") {
                        if (chosenXaxis === "poverty"){
                          return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}%<br>${yLabel}${d[chosenYaxis]}%`)
                        }
                        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}<br>${yLabel}${d[chosenYaxis]}%`)
                      }
                      else if (chosenXaxis === "poverty"){
                        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}%<br>${yLabel}${d[chosenYaxis]}`)
                      }
                      else{
                        return(`${d.state},${d.abbr}<br>${xLabel}${d[chosenXaxis]}<br>${yLabel}${d[chosenYaxis]}`)
                      }
                    })

  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data){
    toolTip.show(data, this);
    d3.select(this).style("stroke", "black"); //

  })
  circlesGroup.on("mouseout", function(data, index){
    toolTip.hide(data, this)
    d3.select(this).style("stroke", "white"); //
  })
  return circlesGroup;
}


//link data, and format data to num values
(async function(){
  const healthData = await d3.csv("assets/data/data.csv");
//d3.csv("assets/data/data.csv").then(function(riskData) {
  healthData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.income = +data.income;
    data.obesity = +data.obesity;
  // console.log(data);
})

//use linearXScale & linearYScale funtion to get data
let xLinearScale = xScale(healthData, chosenXaxis);
let yLinearScale = yScale(healthData, chosenYaxis)

// use const to create axis funtion
const bottomAxis = d3.axisBottom(xLinearScale);
const leftAxis = d3.axisLeft(yLinearScale);

// XAxis
let xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis)

let yAxis = chartGroup.append("g")
.classed("y-axis", true)
.call(leftAxis)

let crlTxtGroup = chartGroup.selectAll("mycircles")
.data(healthData)
.enter()
.append("g")

let circlesGroup = crlTxtGroup.append("circle")
    .attr("cx", d=>xLinearScale(d[chosenXaxis]))
    .attr("cy", d=>yLinearScale(d[chosenYaxis]))
    .classed("stateCircle", true)
    .attr("r", 8)
    .attr("opacity", "1");

let txtGroup = crlTxtGroup.append("text")
      .text(d=>d.abbr)
      .attr("x", d=>xLinearScale(d[chosenXaxis]))
      .attr("y", d=>yLinearScale(d[chosenYaxis])+3)
      .classed("stateText", true)
      .style("font-size", "7px")
      .style("font-weight", "800")

// Create group labels for x and y axis
const xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);
const ylabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${0-margin.left/4}, ${height/2})`);

      const povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .classed("aText", true)
      .text("In Poverty (%)");

const ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .classed("aText", true)
      .text("Age (Median)");

const incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .classed("aText", true)
      .text("Household Income (Median)");

const healthCareLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 20)
      .attr("x", 0)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .classed("active", true)
      .classed("aText", true)
      .text("Lacks Healthcare (%)");

const smokeLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 40)
      .attr("x", 0)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Smokes (%)");

const obesityLabel = ylabelsGroup.append("text")
      .attr("y", 0 - 60)
      .attr("x", 0)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("inactive", true)
      .classed("aText", true)
      .text("Obese (%)");

    circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

// create even listener for X
xlabelsGroup.selectAll("text")
      .on("click", function() {
      const value = d3.select(this).attr("value");
      console.log(`${value} click`)
      if (value !== chosenXaxis) {
          //then replace
          chosenXaxis = value;
          console.log(chosenXaxis)
           
        xLinearScale = xScale(healthData, chosenXaxis);// update scale X for new data
        xAxis = renderXAxes(xLinearScale, xAxis);// transition using x axis
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);//circle values
        txtGroup = renderTexts(txtGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);// text values
  
          //format text
      if (chosenXaxis === "poverty") {
        povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

  else if (chosenXaxis === "age"){
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", true)
            .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

      else{
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        
        circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);


        }
})


})()