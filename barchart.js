function visBar() {
    var margin = { top: 150, bottom: 130, left: 170, right: 270 },
        width = 1370 - margin.left - margin.right,
        height = 570 - margin.top - margin.bottom;

    var svg2 = d3.select('#barchart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .style('border', '3px solid rgb(83, 198, 140)')
        .style('border-radius', '10px')
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    svg2.append("text").text('Number of doses by age groups')
        .attr("x", 300)
        .attr("y", -90)
        .style("font-size", "30px")
        .style("font-weight", "bold");

    var rowConverter = function(d) {
        return {
            age: d['age'],
            province: d['province'],
            dose1: parseInt(d['dose1']),
            dose2: parseInt(d['dose2']),
            dose3: parseInt(d['dose3'])
        }
    }
    d3.csv('https://raw.githubusercontent.com/huynhtrucquyen/DSDV_COVID19VaccinationInVietnam/main/barchart_data.csv', rowConverter, function(error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);

            //Total of 'dose1', 'dose2' and 'dose3'
            var total = [];
            for (var i = 0; i < data.length; i++) {
                var sum = data[i].dose1 + data[i].dose2 + data[i].dose3;
                total.push(sum);
            }
            console.log(total);

            //Keys of 'ages'
            var key = [];
            for (var i = 0; i < data.length; i++) {
                key.push(data[i].age);
            }
            console.log(key);

            // button
            var allGroup = d3.map(data, function(d) {
                return (d.province)
            }).keys()

            // add the options to the button
            d3.select('#selectButton')
                .selectAll('myOptions')
                .data(allGroup)
                .enter()
                .append('option')
                .text(function(d) {
                    return d;
                }) // text showed in the menu
                .attr('value', function(d) {
                    return d;
                }) // corresponding value returned by the button

            // X Scale
            var xScale = d3.scaleLinear()
                .domain([0, d3.max(total)])
                .range([0, width]);

            // Y Scale
            var yScale = d3.scaleBand()
                .range([height, 0])
                .paddingInner(0.2)
                .domain(key);

            var colorScale = d3.scaleOrdinal()
                .range(['rgb(83, 198, 140)', 'rgb(0, 153, 153)', 'rgb(102, 153, 153)']);

            //X-Axis
            var xAxis = svg2.append('g')
                .attr('class', 'xaxis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(xScale))
                .selectAll('text')
                .attr('font-size', '13px')
                .style("font-weight", "bold")
                .attr('y', 17)
                .attr('x', -30)
                .attr('dy', '.35em')
                .style('text-anchor', 'start');
            svg2.append('text')
                .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top + -60) + ')')
                .style('text-anchor', 'middle')
                .attr('font-family', 'sans-serif')
                .attr('font-size', '20px')
                .style("font-weight", "bold")
                .text('Number of people');

            //Y-Axis
            var yAxis = svg2.append('g')
                .attr('class', 'yaxis')
                .call(d3.axisLeft(yScale))
                .selectAll('text')
                .attr('font-size', '13px')
                .style("font-weight", "bold")
                .attr('transform');
            svg2.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -150)
                .attr('x', 0 - (height / 2))
                .attr('dy', '1.5em')
                .style('text-anchor', 'middle')
                .attr('font-family', 'sans-serif')
                .style("font-weight", "bold")
                .attr('font-size', '20px')
                .text('Age');

            //Tooltip
            var tooltip2 = d3.select('body').append('div')
                .attr('class', 'tooltip2')
                .style('opacity', 0);


            //Bars of 'dose1'
            var bar1 = svg2.selectAll('rectdose1')
                .data(data.filter(function(d) {
                    return d.province == allGroup[0]
                }))
                .enter().append('rect')
                .attr('y', function(d) {
                    return yScale(d.age);
                })
                .attr('width', function(d) {
                    return xScale(d.dose1);
                })
                .attr('height', function(d) {
                    return yScale.bandwidth();
                })
                .attr('fill', 'rgb(83, 198, 140)')
                .attr('stroke-width', 3)
                .style('stroke', 'rgb(0, 102, 0)')
                .on('mouseover', function(d) {
                    d3.select(this)
                        .transition().duration(200)
                        .attr('fill', 'rgb(57, 172, 115)')
                    tooltip2
                        .transition().duration(200)
                        .style('opacity', .9);
                    var formatComma = d3.format(',')
                    tooltip2.html('Dose 1' + '<br/>' + 'Numer of people: ' + formatComma(d.dose1))
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 14) + 'px');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .transition().duration(200)
                        .attr('fill', 'rgb(83, 198, 140)')
                    tooltip2
                        .transition().duration(500)
                        .style('opacity', 0);
                });


            //Bars of 'dose2'
            var bar2 = svg2.selectAll('rectdose2')
                .data(data.filter(function(d) {
                    return d.province == allGroup[0]
                }))
                .enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.dose1);
                })
                .attr('y', function(d) {
                    return yScale(d.age);
                })
                .attr('width', function(d) {
                    return xScale(d.dose2);
                })
                .attr('height', function() {
                    return yScale.bandwidth();
                })
                .attr('fill', 'rgb(0, 153, 153)')
                .attr('stroke-width', 3)
                .style('stroke', 'rgb(0, 102, 0)')
                .on('mouseover', function(d) {
                    d3.select(this)
                        .transition().duration(200)
                        .attr('fill', 'rgb(0, 128, 128)')
                    tooltip2
                        .transition().duration(200)
                        .style('opacity', .9);
                    var formatComma = d3.format(',')
                    tooltip2.html('Dose 2' + '<br/>' + 'Numer of people: ' + formatComma(d.dose2))
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 28) + 'px');
                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        .transition().duration(200)
                        .attr('fill', 'rgb(0, 153, 153)')
                    tooltip2
                        .transition().duration(500)
                        .style('opacity', 0);
                });


            //Bars of 'dose3'
            var bar3 = svg2.selectAll('rectdose3')
                .data(data.filter(function(d) {
                    return d.province == allGroup[0]
                }))
                .enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.dose1 + d.dose2);
                })
                .attr('y', function(d) {
                    return yScale(d.age);
                })
                .attr('width', function(d) {
                    return xScale(d.dose3);
                })
                .attr('height', function() {
                    return yScale.bandwidth();
                })
                .attr('fill', 'rgb(102, 153, 153)')
                .attr('stroke-width', 3)
                .style('stroke', 'rgb(0, 102, 0)')
                .on('mouseover', function(d) {
                    d3.select(this)
                        .transition().duration(200)
                        .attr('fill', 'rgb(82, 122, 122)');
                    tooltip2
                        .transition().duration(200)
                        .style('opacity', .9);
                    var formatComma = d3.format(',')
                    tooltip2.html('Dose 3' + '<br/>' + 'Numer of people: ' + formatComma(d.dose3))
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 14) + 'px');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .transition().duration(200)
                        .attr('fill', 'rgb(102, 153, 153)')
                    tooltip2
                        .transition().duration(500)
                        .style('opacity', 0);
                });


            // A function that update the chart
            function update(selectedGroup) {

                // Create new data with the selection?
                var dataFilter = data.filter(function(d) {
                    return d.province == selectedGroup
                })

                var total = [];
                for (var i = 0; i < dataFilter.length; i++) {
                    var sum = dataFilter[i].dose1 + dataFilter[i].dose2 + dataFilter[i].dose3;
                    total.push(sum);
                }
                console.log(total);

                xScale
                    .domain([0, d3.max(total)])
                    .range([0, width]);

                var svg2 = d3.select('body').transition();

                svg2.select('.xaxis')
                    .transition().duration(1000)
                    .call(d3.axisBottom(xScale))
                    .attr('font-size', '13px')
                    .style("font-weight", "bold")
                    .attr('y', 17)
                    .attr('x', -30)
                    .attr('transform', 'translate(0,' + height + ')');


                //Bars of 'dose1'
                bar1
                    .data(dataFilter)
                    .transition().duration(900)
                    .attr('y', function(d) {
                        return yScale(d.age);
                    })
                    .attr('width', function(d) {
                        return xScale(d.dose1);
                    })
                    .attr('height', function(d) {
                        return yScale.bandwidth();
                    })


                //Bars of 'dose2'
                bar2
                    .data(dataFilter)
                    .transition().duration(900)
                    .attr('x', function(d) {
                        return xScale(d.dose1);
                    })
                    .attr('y', function(d) {
                        return yScale(d.age);
                    })
                    .attr('width', function(d) {
                        return xScale(d.dose2);
                    })
                    .attr('height', function() {
                        return yScale.bandwidth();
                    })


                //Bars of 'dose3'
                bar3
                    .data(dataFilter)
                    .transition().duration(900)
                    .attr('x', function(d) {
                        return xScale(d.dose1 + d.dose2);
                    })
                    .attr('y', function(d) {
                        return yScale(d.age);
                    })
                    .attr('width', function(d) {
                        return xScale(d.dose3);
                    })
                    .attr('height', function() {
                        return yScale.bandwidth();
                    })
            }

            // Legend
            var dose = ['Dose 1', 'Dose 2', 'Dose 3'];

            var size = 20

            var legend = svg2.selectAll('myRect')
                .data(dose)
                .enter()
                .append('rect')
                .attr('x', width + 100)
                .attr('y', function(d, i) {
                    return i * (size + 5)
                }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr('width', size)
                .attr('height', size)
                .style('fill', colorScale);

            // Add one dot in the legend for each name.
            var legend = svg2.selectAll('mylabels')
                .data(dose)
                .enter()
                .append('text')
                .attr('font-size', '20px')
                .style("font-weight", "bold")
                .attr('x', width + 130)
                .attr('y', function(d, i) {
                    return i * (size + 6) + (size / 2)
                })
                .style('fill', colorScale)
                .text(d => d)
                .attr('text-anchor', 'left')
                .style('alignment-baseline', 'middle');

            // When the button is changed, run the updateChart function
            d3.select('#selectButton').on('change', function(d) {
                // recover the option that has been chosen
                var selectedOption = d3.select(this).property('value')
                    // run the updateChart function with this selected option

                update(selectedOption)
            })
        }
    })
}
