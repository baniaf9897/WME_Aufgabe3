var props;
var data;
var width = 600;
var height = 200;
var rectWidth ;

var chart1
var chart2

var yScale
var xScale

var xAxis
var yAxis

$.ajax({
    type: "GET",
    dateType: "json",
    url: "http://localhost:3000/properties",
    success: function(result){
        result.splice(result.indexOf("name"),1);
        // result.splice(result.indexOf("id"),1);
        props = result;
        drawDropDowns();
}});

$.ajax({
    type: "GET",
    dateType: "json",
    url: "http://localhost:3000/items",
    success: function(result){
        data = result;
        rectWidth =  width/data.length;
        console.log(rectWidth);
        drawCharts();
}});

function drawCharts(){
    
    yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data.map((item) => item.id))]);
    
    xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((country) => country.name))
    .padding(0.4);
    
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    var svg1 = d3.select("#chart1").append("svg").attr('height',height + 150).attr('width',width + 100);
    chart1 = svg1.append('g').attr('transform', 'translate(50,50)');

    chart1.append('g').classed('y',true).call(yAxis);
   
    chart1.append('g').classed('x',true).attr('transform', 'translate(0, '+ height +')')
    .call(xAxis).selectAll("text")
    .attr("transform", "rotate(90)").attr("dy", ".35em")
    .attr("x", 15).attr("y",0).style("text-anchor", "start");
   
    chart1.selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('id',function(d){
        var stringArray = d.name.split(" ");
        return stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));})
    .attr('x', (s) => xScale(s.name))
    .attr('y', (s) => yScale(s.id))
    .attr('height', (s) => (height) - yScale(s.id))
    .attr("width", rectWidth - 1)
    .attr('fill', '#333333')
    .on('mouseover', function(d,i){

        var name;
        var stringArray = d.name.split(" ");
        name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
        d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
        .attr('fill', '#00ff00');

    })
    .on('mouseout', function(d,i){
    
        var name;
        var stringArray = d.name.split(" ");
        name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
       
        d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
        .attr('fill', '#333333');
    })
    var svg2 = d3.select("#chart2").append("svg").attr('height',height + 150).attr('width',width + 100);
    chart2 = svg2.append('g').attr('transform', 'translate(50,50)');

    chart2.append('g').classed('y',true).call(yAxis);
   
    chart2.append('g').classed('x',true).attr('transform', 'translate(0, '+ height +')')
    .call(xAxis).selectAll("text")
    .attr("transform", "rotate(90)").attr("dy", ".35em")
    .attr("x", 15).attr("y",0).style("text-anchor", "start");
   
    chart2.selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('id',function(d){
        var stringArray = d.name.split(" ");
        return stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));})
    .attr('x', (s) => xScale(s.name))
    .attr('y', (s) => yScale(s.id))
    .attr('height', (s) => height - yScale(s.id))
    .attr("width", rectWidth - 1)
    .attr('fill', '#333333')
    .on('mouseover', function(d,i){

        var name;
        var stringArray = d.name.split(" ");
        name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
       
        d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
        .attr('fill', '#00ff00');

    })
    .on('mouseout', function(d,i){

        var name;
        var stringArray = d.name.split(" ");
        name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
       
        d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
        .attr('fill', '#333333');
    })

}

function drawDropDowns(){
    
    var dropDown1 = d3.selectAll('#select1').append('select')
    .on('change',selectProperty1)

    dropDown1
    .selectAll('option')
	.data(props).enter()
	.append('option')
    .text(function (d) { return d; });

    var dropDown2 = d3.selectAll('#select2').append('select')
    .on('change',selectProperty2)

    dropDown2
    .selectAll('option')
	.data(props).enter()
	.append('option')
    .text(function (d) { return d; });
    
}

function selectProperty1(){
    var selectedProperty = d3.select('#select1').select('select').property("value");
    updateCharts(selectedProperty,chart1);
}
function selectProperty2(){
    var selectedProperty = d3.select('#select2').select('select').property("value");
    updateCharts(selectedProperty,chart2);
}



function updateCharts(prop,_chart){



    yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data.map((item) => item[prop]))]);
    
    yAxis = d3.axisLeft(yScale);

    _chart.select('.y').call(yAxis);

    _chart.selectAll('rect')
    .data(data)
    .attr('id',function(d){
        var stringArray = d.name.split(" ");
        return stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));})
    .attr('x', (s) => xScale(s.name))
    .attr('y', (s) => yScale(s[prop]))
    .attr('height', 
        (s) =>{
            console.log(height - Math.round(yScale(s[prop])));
            if(height - Math.round(yScale(s[prop])) < 0 || yScale(s[prop]) < 0)
                return 0;
            else
                return height - Math.round(yScale(s[prop]))
        }
        )
    .attr("width", rectWidth - 1)
    
}

