//Width and height of map
var width = 770;
var height = 770;

//Define map projection
var projection = d3.geoAlbers()
    .center([100, 4.9])
    .rotate([-9, 50])
    .parallels([20, 30])
    .scale([2500])
    .translate([width / 30, height / 1.3]);

//Define path generator
var path = d3.geoPath()
    .projection(projection);

// Zoom
var zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([
        [0, 0],
        [width, height]
    ])
    .extent([
        [0, 0],
        [width, height]
    ])
    .on('zoom', zoomed);

//Create SVG element
var svg = d3.select('#geomap')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', '3px solid rgb(83, 198, 140)')
    .style('border-radius', '15px')
    .call(zoom)
var g = svg.append('g');

// Define the tooltip
var tooltip1 = d3.select('body').append('div')
    .attr('class', 'tooltip1')

//Load in data
d3.csv('https://raw.githubusercontent.com/huynhtrucquyen/DSDV_COVID19VaccinationInVietnam/main/Geomap_vaccine.csv', function(data) {


    //Load GeoJSON data and merge with provinces data
    d3.json('https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json', function(json) {

        //Loop through each province data doses in the .csv file
        for (var i = 0; i < data.length; i++) {

            //Grab data province 
            var dataProvince = parseFloat(data[i].ma);
            console.log(json.features[0].properties.Ma);

            //Grab data doses
            var province = data[i].doses;

            //Find the corresponding province inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

                var jsonProvince = json.features[j].properties.Ma;

                if (dataProvince == jsonProvince) {

                    //Copy the data doses into the JSON
                    json.features[j].properties.doses = province;

                    //Stop looking through the JSON
                    break;
                }
            }

            //Loop to get province name
            //Grab province name
            var dataName = data[i].province;

            //Find the corresponding province inside the GeoJSON
            for (var k = 0; k < json.features.length; k++) {

                var jsonProvince = json.features[k].properties.Ma;

                if (dataProvince == jsonProvince) {

                    //Copy the data doses into the JSON
                    json.features[k].properties.province = dataName;

                    //Stop looking through the JSON
                    break;
                }
            }
        }

        //Bind data to the SVG and create one path per GeoJSON feature
        var map = g.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', function(d) {
                value = d.properties.doses;
                if (value > 10000000) {
                    return 'rgb(14, 90, 7)';
                } else if (value > 3000000) {
                    return 'rgb(11, 144, 4)';
                } else if (value > 1000000) {
                    return 'rgb(65, 195, 65)';
                } else {
                    return 'rgb(190, 255, 179)';
                }
            })
            .on('mouseover', function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1)
                    .style('stroke', '#404040')
                tooltip1.transition()
                    .duration(200)
                    .style('opacity', 0.9)
                    .style('stroke', 'black')
                tooltip1.html(d.province);
            })
            .on('mousemove', function(d) {
                tooltip1
                    .style('top', (d3.event.pageY) + 'px')
                    .style('left', (d3.event.pageX + 15) + 'px')
                var formatComma = d3.format(',')
                tooltip1.html(d.properties.province + (' <br>Number of doses injected: ') + formatComma(d.properties.doses))
                    .style('border-radius', '8px');
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('stroke', 'transparent')
                tooltip1
                    .transition()
                    .duration(200)
                    .style('opacity', 0);
            });
    });
});


function zoomed() {
    g
        .selectAll('path')
        .attr('transform', d3.event.transform);
}
