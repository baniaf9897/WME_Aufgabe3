var props;
var data;
var width = 600;
var height = 300;

var svg 
var chart

var yScale
var xScale
$.ajax({
    type: "GET",
    dateType: "json",
    url: "http://localhost:3000/properties",
    success: function(result){
        result.splice(result.indexOf("name"),1);
        result.splice(result.indexOf("id"),1);
        props = result;
        drawDropDowns();
}});

$.ajax({
    type: "GET",
    dateType: "json",
    url: "http://localhost:3000/items",
    success: function(result){
        data = result;
        drawCharts();
}});

function drawCharts(){
    
    yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 3000]);
    
    xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((country) => country.name))
    .padding(0.4);
    
    

    svg = d3.select("svg").attr('height',height + 150).attr('width',width + 100);
    chart = svg.append('g').attr('transform', 'translate(50,50)');

    chart.append('g').call(d3.axisLeft(yScale));
   
    chart.append('g').attr('transform', 'translate(0, '+ height +')')
    .call(d3.axisBottom(xScale)).selectAll("text")
    .attr("transform", "rotate(90)").attr("dy", ".35em")
    .attr("x", 15).attr("y",0).style("text-anchor", "start");
   
    chart.selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (s) => xScale(s.name))
    .attr('y', (s) => yScale(s.id))
    .attr('height', (s) => height - yScale(s.id))
    .attr('width', xScale.bandwidth())

}

function drawDropDowns(){
    
    var dropDown = d3.select('select')
    .on('change',selectProperty)

    var options = dropDown
    .selectAll('option')
	.data(props).enter()
	.append('option')
    .text(function (d) { return d; });
}

function selectProperty(){
    var selectedProperty = d3.select('select').property("value");
    updateCharts(selectedProperty);
}


function updateCharts(prop){


    chart.selectAll('rect')
    .data(data)
    .attr('x', (s) => xScale(s.name))
    .attr('y', (s) => yScale(s[prop]))
    .attr('height', (s) => height - yScale(s.id))
    .attr('width', xScale.bandwidth())


}

