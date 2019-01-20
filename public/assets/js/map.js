
// Scene Configurations
const WIDTH = window.innerWidth;
const HEIGHT =window.innerHeight;
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;


var key = "pk.eyJ1IjoicGlra3UiLCJhIjoiY2pwenloamxoMDl0djQybWxlY3hkaGVpZSJ9.MKRV1BETvooEv5r_dEaXTQ";

//selectable properties
props = ["birth_rate_per_1000","cell_phones_per_100","children_per_woman","electricity_consumption_per_capita","life_expectancy"];


//options for map
var options = {
    lat: -0.77176,
    lng: 11.689,
    zoom: 4,
    style: "mapbox://styles/mapbox/dark-v9"
};

//defining map 
const canvas = document.getElementById("mapa");
var mappa = new Mappa("MapboxGL",key);
var map = mappa.tileMap(options);
map.overlay(canvas);
map.onChange(update);

var bars = [];
//getting data through ajax
var data;
$(document).ready(function() {
        $.ajax({
            type: "GET",
            dateType: "json",
            url: "http://localhost:3000/items",
            success: function (result) {
                data = result;
                renderBarCharts();
            }
    });
});


// Scene, camera, canvas, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });

camera.position.set( 0, 0, 500 );
scene.add(camera);
renderer.setSize(WIDTH, HEIGHT);

// Light
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(500, 500, 600);
scene.add(light);



//composing dropDown and filling with properties
var dropDown = d3.select('#select').append('select')
.on('change',selectProperty)

dropDown
.selectAll('option')
.data(props).enter()
.append('option')
.text(function (d) { return d; });

//update function of dropDown
function selectProperty(){
    var selectedProperty = d3.select('#select').select('select').property("value");
    updateBars(selectedProperty)
}

//renders bars 
function renderBarCharts(){
    //defining color of bars
    var material = new THREE.MeshLambertMaterial( { color: 0xF86E70 } );

    //looping through every country
    data.forEach(country => {
        //translate latitude and longitude to x,y coordinates
        var coord =  map.latLngToPixel(Number(country.gps_lat), Number(country.gps_long));
        console.log(coord);
        // defining bars with size
        var geometry = new THREE.BoxGeometry( 5, country.life_expectancy, 5);
        var cube = new THREE.Mesh( geometry, material );
        cube.rotateY(-30);
        cube.rotateZ(-50);
        cube.position.x = coord.x;
        cube.position.y = coord.y;
        cube.position.z = 10;
        scene.add( cube );
        bars.push(cube)
       
    });

    renderer.render(scene,camera);

}

function updateBars(prop){
    var material = new THREE.MeshLambertMaterial( { color: 0xF86E70 } );


    data.forEach(country => {
       
        var coord =  map.latLngToPixel(Number(country.gps_lat), Number(country.gps_long));
        console.log(coord);
        var geometry = new THREE.BoxGeometry( 5, country[prop], 5);
        var cube = new THREE.Mesh( geometry, material );
        cube.rotateY(-30);
        cube.rotateZ(-50);
        cube.position.x = coord.x;
        cube.position.y = coord.y;
        cube.position.z = 9;
        scene.add( cube );
       
    });
    renderer.render(scene,camera);

}

//update function , triggered by map 
function update(){

}
