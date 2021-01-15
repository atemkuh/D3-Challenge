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
  
    //default selection
  var defaultXaxis = "poverty";
  var defaultYaxis = "healthcare"

//create a function using xAxis const to update data  when clicked
function renderXaxis(newLinearXscale,xAxis){
  const bottomAxis = d3.axisBottom(newLinearXscale);

  xAxis.tansition()
      .duration(700)
      .call(bottomAxis)
  return xAxis;
}
//create a function using xAxis const to update data  when clicked

function renderYaxis(newLinearYscale,yAxis){
  const leftAxis = d3.axisLeft(newLinearYscale);

  yAxis.tansition()
      .duration(700)
      .call(leftAxis)
  return yAxis;
}
//update circles and text group with a transition

function displayCircles(circlesGroup,newLinearXscale,newLinearYscale, defaultXaxis,defaultYaxis){
  circlesGroup.transition()
  .duration(700)
  .attr("cx", d => newLinearXscale(d[defaultXaxis]))
  .attr("cy", d =>newLinearYscale(d[defaultYaxis]));
return circlesGroup;
}
//text
function displayTexts(textGroup,newLinearXscale,newLinearYscale, defaultXaxis,defaultYaxis){
  textGroup.transition()
  .duration(700)
  .attr("cx", d => newLinearXscale(d[defaultXaxis]))
  .attr("cy", d =>newLinearYscale(d[defaultYaxis]));
return textGroup;
}

//use function to ccreate and update x and y scales 
//X
function xScale(healthData,defaultXaxis){
  const xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d[defaultXaxis]*0.8), d3.max(healthData,d=>d[defaultXaxis]*1.2)])
  .range([0,width]);
return xLinearScale;
}
//Y
function yScale(healthData,defaultYaxis){
  const yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d[defaultYaxis]*0.8), d3.max(healthData,d=>d[defaultYaxis]*1.2)])
  .range([0,height]);
return yLinearScale;
}

//tooltip function for circles

function toolTipProperty(defaultXaxis,defaultYaxis,circlesGroup){
  var xLabel = ""
  var yLabel = ""
  if (defaultXaxis === "poverty"){
    xLabel = "Poverty: ";
  }
  else if (defaultXaxis === "age"){
    xLabel = "Age: ";
  }
  else{
    xLabel = "Income: $";
  }
  if (defaultYaxis === "healthcare"){
    yLabel = "Healthcare: "
  }
  else if (defaultYaxis === "smokes"){
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
                      if (defaultYaxis === "smokes" || defaultYaxis === "obesity") {
                        if (defaultXaxis === "poverty"){
                          return(`${d.state},${d.abbr}<br>${xLabel}${d[defaultXaxis]}%<br>${yLabel}${d[defaultYaxis]}%`)
                        }
                        return(`${d.state},${d.abbr}<br>${xLabel}${d[defaultXaxis]}<br>${yLabel}${d[defaultYaxis]}%`)
                      }
                      else if (defaultXaxis === "poverty"){
                        return(`${d.state},${d.abbr}<br>${xLabel}${d[defaultXaxis]}%<br>${yLabel}${d[defaultYaxis]}`)
                      }
                      else{
                        return(`${d.state},${d.abbr}<br>${xLabel}${d[defaultXaxis]}<br>${yLabel}${d[defaultYaxis]}`)
                      }
                    })

  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data){
  toolTip.show(data, this);
  d3.select(this).style("stroke", "black");
  })
 
  circlesGroup.on("mouseover", function(data,index){
  toolTip.hide(data, this);
  d3.select(this).style("stroke", "white");
  })
   return circlesGroup;
}


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
})

//use linearXScale & linearYScale funtion to get data
var xLinearScale = xScales(healthData, defaultXaxis);
var yLinearScale = yScales(healthData,defaultYaxis)

// use const to create axis funtion
  const bottomAxis = d3.axisBottom(xLinearScale);
  const leftAxis = d3.axisLeft(yLinearScale);

// XAxis
var xAxis = chartGroup.append("g")
                        .classed("x-axis", true)
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis)
var yAxis = chartGroup.append("g")
                        .classed("y-axis", true)
                        .call(leftAxis)
var crlTxtGroup = chartGroup.selectAll("mycircles")
                        .data(healthData)
                        .enter()
                        .append("g")
var circlesGroup = crlTxtGroup.append("circle")
                        .attr("cx", d=>xLinearScale(d[defaultXaxis]))
                        .attr("cy", d=>yLinearScale(d[defaultXaxis]))
                        .classed("stateCircle", true)
                        .attr("r", 8)
                        .attr("opacity", "1");
var textGroup = crlTxtGroup.append("text")
                        .text(d=>d.abbr)
                        .attr("x", d=>xLinearScale(d[defaultXaxis]))
                        .attr("y", d=>yLinearScale(d[defaultYaxis])+3)
                        .classed("stateText", true)
                        .style("font-size", "7px")
                        .style("font-weight", "800")

// Create group labels for x and y axis
  const groupLabelX= chartGroup.append("g")
                          .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

  const groupLabelY = chartGroup.append("g")
                          .attr("transform", `translate(${0-margin.left/4}, ${height/2})`);

  const labelPoverty = groupLabelX.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("value", "poverty") 
                        .classed("active", true)
                        .classed("aText", true)
                        .text("In Poverty (%)");


  const labelAge= groupLabelX.append("text")
                        .attr("x", 0)
                        .attr("y", 20)
                        .attr("value", "age")
                        .classed("inactive", true)
                        .classed("aText", true)
                        .text("Age (Median)");


  const labelIncome= groupLabelX.append("text")
                          .attr("x", 0)
                          .attr("y", 40)
                          .attr("value", "income")
                          .classed("inactive", true)
                          .classed("aText", true)
                          .text("Household Income (Median)");


  const labelHealthCare= groupLabelY.append("text")
                          .attr("y", 0 - 20)
                          .attr("x", 0)
                          .attr("transform", "rotate(-90)")
                          .attr("dy", "1em")
                          .attr("value", "healthcare")
                          .classed("active", true)
                          .classed("aText", true)
                          .text("Lacks Healthcare (%)");


  const labelSmoke = groupLabelY.append("text")
                          .attr("y", 0 - 40)
                          .attr("x", 0)
                          .attr("transform", "rotate(-90)")
                          .attr("dy", "1em")
                          .attr("value", "smokes")
                          .classed("inactive", true)
                          .classed("aText", true)
                          .text("Smokes (%)");


  const labelObesity = groupLabelY.append("text")
                          .attr("y", 0 - 60)
                          .attr("x", 0)
                          .attr("transform", "rotate(-90)")
                          .attr("dy", "1em")
                          .attr("value", "obesity")
                          .classed("inactive", true)
                          .classed("aText", true)
                          .text("Obese (%)");


circlesGroup = toolTipProperty(defaultXaxis,defaultYaxis,circlesGroup);

// create even listener for X

    groupLabelX.selectAll("text")
      .on("click", function(){
        const value = d3.select(this)
        .attr("value");
        console.log('${value} click')
        if (value!==defaultXaxis){
          //then replace
          defaultXaxis = value
          console.log(defaultYaxis)
          xLinearScale = xScales(healthData,defaultXaxis);// update scale X for new data
          xAxis =renderXaxis(xLinearScale)


        }
      })

})()