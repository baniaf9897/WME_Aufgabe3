var props;
var data;
var width = 600;
var height = 150;
var rectWidth ;

var chart1
var chart2

var yScale
var xScale

var xAxis
var yAxis
//Variablen für die Map
var mymap;
var marker;
var markdata;
//erstellen des Icon mit ExtraMarkers
var newMarker = L.ExtraMarkers.icon({
    icon: 'fa-circle',
    markerColor: 'orange',
    shape: 'circle',
    prefix: 'fa'
});
//erstellen des Hover-Icon mit ExtraMarkers
var hoverMarker = L.ExtraMarkers.icon({
    icon: 'fa-circle',
    markerColor: 'green',
    shape: 'circle',
    prefix: 'fa'
});

$(document).ready(function() {
//items werden durch ajax in Variable geladen
    $.ajax({
        type: "GET",
        dateType: "json",
        url: "http://localhost:3000/items",
        success: function (result) {
            markdata = result;
            //starten der Funktion, die die Map erstellt
            map();
        }
    });
});
//properties werden geladen, via ajax
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
//daten werden geladen, via ajax
$.ajax({
    type: "GET",
    dateType: "json",
    url: "http://localhost:3000/items",
    success: function(result){
        data = result;
        rectWidth =  width/data.length;
        drawCharts();
}});
//tabellen werden gezeichnet
function drawCharts(){
    
    //scale für y achse wird definiert und initial mit den ID Nummern beschriftet
    yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data.map((item) => item.id))]);
    
    //scale für x achse wird definiert und mit den Länder namen beschriftet , diese Achse bleibt konstant
    xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((country) => country.name))
    .padding(0.4);
    
    // x und y Achse werden nun mithilfe der Scales initialisiert
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);

    //div wird mittels d3 selektiert und Größe definiert => Rahmen für Chart
    var svg1 = d3.select("#chart1").append("svg").attr('height',height + 150).attr('width',width + 100);
    //chart wird innerhalb des Rahmens eingefügt, dabei je um 50px hereingesetzt, für Beschriftung
    chart1 = svg1.append('g').attr('transform', 'translate(50,50)');

     //yAchse in Chart eingefügt
    chart1.append('g').classed('y',true).call(yAxis);
    //xAchse in Chart eingefügt und Beschriftung um 90 Grad gedreht 
    chart1.append('g').classed('x',true).attr('transform', 'translate(0, '+ height +')')
    .call(xAxis).selectAll("text")
    .attr("transform", "rotate(90)").attr("dy", ".35em")
    .attr("x", 15).attr("y",0).style("text-anchor", "start");
   
    //Bars in Chart eingefügt, dazu auf selectAll() zugegriffen , welches für jeden Eintrag in data eine Bar zeichnet, Größe und Id werden dynamisch berechnet
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

        //Name wird herausgelesen und getrimmt,
        //anschließend wird nach allen Elementen mit gleicher ID gesucht
        //und Hover-Animation angewendet
        var name;
        var stringArray = d.name.split(" ");
        name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
        d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
        .attr('fill', '#00ff00');
        //Schleife für Synchronität des Hover-Effekt
        for (i = 0; i < markerArray.length; i++) {
            var name2;
            var stringArray2 = markerArray[i].options.title.split(" ");
            name2 = stringArray2.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
            if (name2 == name){
                markerArray[i].setOpacity(0.5);
            }
        }

    })
    .on('mouseout', function(d,i){
    
        var name;
        var stringArray = d.name.split(" ");
        name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
       // analog zu mouseover nur dass hier die Hover-Animation wieder rückgängig gemacht wird
        d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
        .attr('fill', '#333333');
        //Schleife für Synchronität des Hover-Effekt
        for (i = 0; i < markerArray.length; i++) {
            var name2;
            var stringArray2 = markerArray[i].options.title.split(" ");
            name2 = stringArray2.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
            if (name2 == name){
                markerArray[i].setOpacity(1);
            }
        }
    })

    //analog zur ersten Chart
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
        //Schleife für Synchronität des Hover-Effekt
        for (i = 0; i < markerArray.length; i++) {
            var name2;
            var stringArray2 = markerArray[i].options.title.split(" ");
            name2 = stringArray2.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
            if (name2 == name){
                markerArray[i].setOpacity(0.5);
            }
        }

    })
    .on('mouseout', function(d,i){

        var name;
        var stringArray = d.name.split(" ");
        name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
       
        d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
        .attr('fill', '#333333');
        //Schleife für Synchronität des Hover-Effekt
        for (i = 0; i < markerArray.length; i++) {
            var name2;
            var stringArray2 = markerArray[i].options.title.split(" ");
            name2 = stringArray2.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
            if (name2 == name){
                markerArray[i].setOpacity(1);
            }
        }
    })

}

function drawDropDowns(){
    //div wird mittels d3 selektiert und ein select Element eingefügt
    //event-listener on Change 
    //bei Änderung wird selectProperty1() aufgerufen
    var dropDown1 = d3.select('#select1').append('select')
    .on('change',selectProperty1)

    //für jedes Element in props wird nun ein option Element eingefügt
    dropDown1
    .selectAll('option')
	.data(props).enter()
	.append('option')
    .text(function (d) { return d; });

    //analog zu dropDown1
    var dropDown2 = d3.select('#select2').append('select')
    .on('change',selectProperty2)

    dropDown2
    .selectAll('option')
	.data(props).enter()
	.append('option')
    .text(function (d) { return d; });
    
}

function selectProperty1(){
    //neuer Wert wird aus Select-Box herausgelesen und updateChart() aufgerufen
    var selectedProperty = d3.select('#select1').select('select').property("value");
    updateCharts(selectedProperty,chart1);
}
function selectProperty2(){
    //analog zu selectProperty1()
    var selectedProperty = d3.select('#select2').select('select').property("value");
    updateCharts(selectedProperty,chart2);
}



function updateCharts(prop,_chart){
    //yScale wird an neu ausgewählter Property angepasst(Beschriftung).
    yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data.map((item) => item[prop]))]);
    //y Achse wird aktualisiert
    yAxis = d3.axisLeft(yScale);
    //Chart wird neue y Achse übergeben
    _chart.select('.y').call(yAxis);
    //Bars werden mit neuen Daten aktualisiert
    _chart.selectAll('rect')
    .data(data)
    .attr('id',function(d){
        var stringArray = d.name.split(" ");
        return stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));})
    .attr('x', (s) => xScale(s.name))
    .attr('y', (s) => yScale(s[prop]))
    .attr('height', 
        (s) =>{
            if(height - Math.round(yScale(s[prop])) < 0 || yScale(s[prop]) < 0)
                return 0;
            else
                return height - Math.round(yScale(s[prop]))
        }
        )
    .attr("width", rectWidth - 1)
    //nach Update der Charts wird die Map aktualisiert
    //alle Layer werden gelöscht
    mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });
    //Map wird neu geladen
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo(mymap);
    //Funktion startet erstellen der Marker
    marks();
}
//initialisiert die Map
function map() {
    //Startpunkt der Map
    mymap = L.map('mapid').setView([51.505, -0.09], 2);
    //Karte laden
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo(mymap);
    //Funktion startet erstellen der Marker
    marks();
}
//erstellt Marker
function marks() {
    markerArray = [];
    //Schleife, weil 25 Marker
    for (var i = 0; i < 25; i++) {
        //Koordinaten aus Element von Markdata werden genommen und Marker erstellt
        marker = new L.marker([markdata[i].gps_lat, markdata[i].gps_long], {icon: newMarker,title: markdata[i].name});
        //add Layer
        mymap.addLayer(marker);
        //Popup-Nachricht
        //sucht ausgewählte Property und sucht dann passenden Datensatz in markdata
        var s1 = d3.select('#select1').select('select').property("value");
        var d1 = markdata[i][s1];
        var s2 = d3.select('#select2').select('select').property("value");
        var d2 = markdata[i][s2];
        //Nachricht erstellt und an Marker gebunden
        marker.bindPopup(markdata[i].name + "<br>" + s1 + "<br>" + d1+"<br>"+s2+ "<br>" + d2);
        //Hover-Effekt für Marker
        marker.on('mouseover',function(ev) {
            var lat = ev.latlng.lat;
            var lng = ev.latlng.lng;

            var country = markdata.filter((el) => {
                return el.gps_lat == lat && el.gps_long == lng
            })
            var name;
            var stringArray = country[0].name.split(" ");
            name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
       
            d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
            .attr('fill', '#00ff00');

            this.setOpacity(0.5);
        })
        //Hover-Effekt für Marker
        marker.on('mouseout', function (ev) {
            var lat = ev.latlng.lat;
            var lng = ev.latlng.lng;

            var country = markdata.filter((el) => {
                return el.gps_lat == lat && el.gps_long == lng
            })
            var name;
            var stringArray = country[0].name.split(" ");
            name = stringArray.reduce((concatStrings,currentString) =>concatStrings.concat(currentString));
       
            d3.selectAll("[id=".concat(name).concat( ']')).transition().duration(300)
            .attr('fill', '#333333');
            this.setOpacity(1.0);

        });
        markerArray.push(marker);
    }
}
