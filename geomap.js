//Width and height of map
var width = 700,
    height = 770;

//Define map projection
var projection = d3.geoAlbers()
    .center([101, 5])
    .rotate([-9, 50])
    .parallels([25, 30])
    .scale([2300])
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

var svg = d3.select('#geomap')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', '3px solid rgb(83, 198, 140)')
    .style('border-radius', '10px')
    .call(zoom);

svg.append("text");
svg.append('color');


/// Update function
function vis(ageRange) {
    d3.selectAll('table').remove();
    var ageRangeName = '';
    var ratio1 = '';
    var ratio2 = '';
    var ratio3 = '';
    var title = '';

    if (ageRange == "population_18andover") {
        ageRangeName = ' <br>Population of age 18 and over: ';
        ratio1 = "the_ratio_of_dose1_population_18andover";
        ratio2 = 'the_ratio_of_dose2_population_18andover';
        ratio3 = 'the_ratio_of_dose3_population_18andover';
        title = 'POPULATION OF AGE 18 AND OVER';
    } else if (ageRange == "population_12to17") {
        ageRangeName = ' <br>Population of age 12 to 17: ';
        ratio1 = 'the_ratio_of_dose1_population_12to17';
        ratio2 = 'the_ratio_of_dose2_population_12to17';
        ratio3 = 'the_ratio_of_dose3_population_12to17';
        title = 'POPULATION OF AGE 12 TO 17';

    } else if (ageRange == "population_5to11") {
        ageRangeName = ' <br>Population of age 5 to 11: ';
        ratio1 = 'the_ratio_of_dose1_population_5to11';
        ratio2 = 'the_ratio_of_dose2_population_5to11';
        ratio3 = 'the_ratio_of_dose3_population_5to11';
        title = 'POPULATION OF 5 TO 11';
    }

    var g = svg.append('g');

    var formatComma = d3.format(',')

    var chartWidth = '100px',
        percent = d3.format('.2%');

    //Define color scale
    var colorScale = d3.scaleThreshold()
        // .range(['rgb(190, 255, 179)','rgb(0,255,0)','rgb(127,255,0)', 'rgb(65, 195, 65)', 'rgb(11, 144, 4)', 'rgb(14, 90, 7)']);
        .domain([100000, 500000, 1000000, 2000000])
        .range(["rgb(198, 235, 198)", 'rgb(121, 210, 121)', 'rgb(0, 153, 77)', 'rgb(31, 96, 31)'])
    var colorScale2 = d3.scaleOrdinal()
        .range(["rgb(198, 235, 198)", 'rgb(121, 210, 121)', 'rgb(0, 153, 77)', 'rgb(31, 96, 31)'])

    // Define the tooltip
    var tooltip1 = d3.select('body').append('div')
        .attr('class', 'tooltip1')
        .style('opacity', 0);

    var table = d3.select('#table').append('table'),
        thead = table.append('thead').append('tr'),
        tbody = table.append('tbody');

    //Load in data
    d3.csv('https://raw.githubusercontent.com/huynhtrucquyen/DSDV_COVID19VaccinationInVietnam/main/geomap_data.csv', function(data) {

        // colorScale.domain([
        //     d3.min(data, function(d) {
        //         return d[ageRange];
        //     }),
        //     d3.max(data, function(d) {
        //         return d[ageRange];
        //     })
        // ]);
        //Load GeoJSON data and merge with provinces data
        d3.json('https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json', function(json) {

            //Loop through each province data population_18andover in the .csv file
            for (var i = 0; i < data.length; i++) {

                //Grab data province 
                var dataProvince = parseFloat(data[i].ma);
                console.log(json.features[0].properties.Ma);

                //Grab data population_18andover
                var dataP = data[i][ageRange];

                //Find the corresponding province inside the GeoJSON
                for (var j = 0; j < json.features.length; j++) {

                    var jsonProvince = json.features[j].properties.Ma;

                    if (dataProvince == jsonProvince) {

                        //Copy the data population_18andover into the JSON
                        json.features[j][ageRange] = dataP;
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

                        //Copy the data population_18andover into the JSON
                        json.features[k].properties.province = dataName;

                        //Stop looking through the JSON
                        break;
                    }
                }
            }
            // console.log(json.features[1].properties);
            // console.log("-------------------------------------");
            // svg.text(title);

            svg.select("text")
                .attr("x", 340)
                .attr("y", 45)
                .attr("text-anchor", "middle")
                .style("font-size", "25px")
                .style("font-weight", "bold").text(title);

            //Bind data to the SVG and create one path per GeoJSON feature
            var map = g.selectAll('path')
                .data(json.features)
                .enter()
                .append('path')
                // .transition().duration(700)
                .attr('d', path)
                .style('fill', function(d) {
                    var value = d[ageRange];
                    console.log(value, colorScale(value));
                    return colorScale(value);
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
                    tooltip1.html(d.properties.Ten + (ageRangeName) + formatComma(d[ageRange]))
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


            //----- TABLE -----//

            // Create a table1 with rows and bind a data row to each table1 row
            var trows = tbody.selectAll('td')
                .data(data)
                .enter()
                .append('tr')
                .attr('class', 'datarow')

            // Province column
            thead.append('th').text('Province');
            trows.append('td').attr('class', 'data name')
                .text(function(d) {
                    return d.province
                })

            // Population 18 and over column
            thead.append('th').text('Population');
            trows.append('td').attr('class', 'data name')
                .text(function(d) {
                    return formatComma(d[ageRange])
                })
                .style('text-align', 'center ');

            // Set the even columns
            d3.selectAll('.datarow').filter(':nth-child(even)').attr('class', 'datarow even')

            //Dose 1
            thead.append('th').text('The ratio of dose 1');
            // Create a column at the beginning of the table1 for the chart
            var chart1 = trows.append('td').attr('class', 'chart1').attr('width', chartWidth);
            // Create the div structure of the chart
            chart1.append('div').attr('class', 'container').append('div').attr('class', 'bar1');
            // Setup the scale for the values for display, use abs max as max value
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                    return Math.abs(d[ratio1]);
                })])
                .range(['0%', '100%']);
            // Creates the bar
            trows.select('div.bar1')
                .style('width', '0%')
                .transition().duration(500)
                .style('width', function(d) {
                    return d[ratio1] > 0 ? x(d[ratio1]) : '0%';
                })
                .text(function(d) {
                    return percent(d[ratio1])
                });

            // Dose 2
            thead.append('th').text('The ratio of dose 2');
            // Create a column at the beginning of the table1 for the chart
            var chart2 = trows.append('td')
                .attr('class', 'chart2')
                .attr('width', chartWidth);
            // Create the div structure of the chart
            chart2.append('div').attr('class', 'container').append('div').attr('class', 'bar2');
            // Setup the scale for the values for display, use abs max as max value
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                    return Math.abs(d[ratio2]);
                })])
                .range(['0%', '100%']);
            // Creates the bar
            trows.select('div.bar2')
                .style('width', '0%')
                .transition().duration(500)
                .style('width', function(d) {
                    return d[ratio2] > 0 ? x(d[ratio2]) : '0%';
                })
                .text(function(d) {
                    return percent(d[ratio2])
                });

            // Dose 3
            thead.append('th').text('The ratio of dose 3 ');
            // Create a column at the beginning of the table1 for the chart
            var chart3 = trows.append('td').attr('class', 'chart3').attr('width', chartWidth);
            // Create the div structure of the chart
            chart3.append('div').attr('class', 'container').append('div').attr('class', 'bar3');
            // Setup the scale for the values for display, use abs max as max value
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                    return Math.abs(d[ratio3]);
                })])
                .range(['0%', '100%']);
            // Creates the bar
            trows.select('div.bar3')
                .style('width', '0%')
                .transition().duration(500)
                .style('width', function(d) {
                    return d[ratio3] > 0 ? x(d[ratio3]) : '0%';
                })
                .text(function(d) {
                    return percent(d[ratio3])
                });

            var value = [10000, 100000, 500000, 2000000];
            var value2 = ['< 100.000', '< 500.000', '< 1.000.000', '≥ 2.000.000'];

            var size = 20

            var legend = svg.selectAll('myRect')
                .data(value)
                .enter()
                .append('rect')
                .attr('x', width + 160)
                .attr('y', function(d, i) {
                    return i * (size + 5) + 94
                }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr('width', size)
                .attr('height', size)
                .style('fill', colorScale);

            // Add one dot in the legend for each name.
            var legend = svg.selectAll('mylabels')
                .data(value2)
                .enter()
                .append('text')
                .attr('font-size', '20px')
                .style("font-weight", "bold")
                .attr('x', width + 190)
                .attr('y', function(d, i) {
                    return i * (size + 6) + (size / 2) + 100
                })
                .style('fill', colorScale2)
                .text(d => d)
        });
    });
}

function zoomed() {
    svg
        .selectAll('path')
        .attr('transform', d3.event.transform);
}
