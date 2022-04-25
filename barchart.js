var rowConverter = function(d) {
    return {
        dose: d['doses'],
        adults: parseInt(d['adults']),
        children: parseInt(d['children'])
    }
}

//Dimession and Margin
var margin = { top: 30, bottom: 90, left: 110, right: 270 },
    width = 970 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

var svg = d3.select('#barchart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('border', '3px solid rgb(83, 198, 140)')
    .style('border-radius', '15px')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


d3.csv('https://raw.githubusercontent.com/huynhtrucquyen/DSDV_COVID19VaccinationInVietnam/main/BarChart_vaccine.csv', rowConverter, function(error, data) {
    if (error) {
        console.log(error);
    } else {
        console.log(data);

        //Total of 'Adults' and 'Children' 
        var total = [];
        for (var i = 0; i < data.length; i++) {
            var sum = data[i].adults + data[i].children;
            total.push(sum);
        }
        console.log(total);

        //Keys of 'doses'
        var keys = [];
        for (var i = 0; i < data.length; i++) {
            keys.push(data[i].dose);
        }
        console.log(keys);

        var xScale = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(total)]);

        var yScale = d3.scaleBand()
            .range([height, 0])
            .paddingInner(0.05)
            .align(0.1)
            .domain(keys);

        var colorScale = d3.scaleOrdinal()
            .range(['rgb(83, 198, 140)', 'rgb(0, 255, 128)']);

        //X-Axis
        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('y', 12)
            .attr('x', -6)
            .attr('dy', '.35em')
            .style('text-anchor', 'start');
        svg.append('text')
            .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top + 25) + ')')
            .style('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 12)
            .text('Number of doses');

        //Y-Axis
        svg.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .attr('transform', 'rotate()');
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '2em')
            .style('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 12)
            .text('Doses');

        //Tooltip
        var tooltip2 = d3.select('body').append('div')
            .attr('class', 'tooltip2')
            .style('opacity', 0);

        //Bars of 'Adults'
        svg.selectAll('rectadults')
            .data(data)
            .enter().append('rect')
            .attr('y', function(d) {
                return yScale(d.dose);
            })
            .attr('width', function(d) {
                return xScale(d.adults);
            })
            .attr('height', function(d) {
                return yScale.bandwidth();
            })
            .attr('fill', 'rgb(83, 198, 140)')
            .attr('stroke-width', 3)
            .style('stroke', 'rgb(0, 102, 0)')
            .on('mouseover', function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', 'rgb(51, 153, 102)')
                tooltip2.transition()
                    .duration(200)
                    .style('opacity', .9)
            })
            .on('mousemove', function(d) {
                tooltip2
                    .style('top', (d3.event.pageY) + 'px')
                    .style('left', (d3.event.pageX + 15) + 'px')
                var formatComma = d3.format(',')
                tooltip2.html('Adults' + '<br/>' + 'Doses: ' + formatComma(d.adults))
                    .style('border-radius', '8px');
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', 'rgb(83, 198, 140)')
                tooltip2
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        //Bars of 'Children'
        svg.selectAll('rectchildren')
            .data(data)
            .enter().append('rect')
            .attr('x', function(d) {
                return xScale(d.adults);
            })
            .attr('y', function(d) {
                return yScale(d.dose);
            })
            .attr('width', function(d) {
                return xScale(d.children);
            })
            .attr('height', function() {
                return yScale.bandwidth();
            })
            .attr('fill', 'rgb(0, 255, 128)')
            .attr('stroke-width', 3)
            .style('stroke', 'rgb(0, 102, 0)')
            .on('mouseover', function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', 'rgb(0, 204, 102)')
                tooltip2.transition()
                    .duration(200)
                    .style('opacity', .9);
            })
            .on('mousemove', function(d) {
                tooltip2
                    .style('top', (d3.event.pageY) + 'px')
                    .style('left', (d3.event.pageX + 15) + 'px')
                var formatComma = d3.format(',')
                tooltip2.html('Children' + '<br/>' + 'Doses: ' + formatComma(d.children))
                    .style('border-radius', '8px');
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', 'rgb(0, 255, 128)')
                tooltip2.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        // Legend
        var age = ['Adults (>=18 years old)', 'Children (12-17 years old)'];

        var legend = svg.append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 15)
            .attr('text-anchor', 'end')
            .selectAll('g')
            .data(age)
            .enter().append('g')
            .attr('transform', function(d, i) {
                return 'translate(0,' + i * 20 + ')';
            });

        legend.append('rect')
            .attr('x', width + 230)
            .attr('width', 19)
            .attr('height', 19)
            .attr('fill', colorScale);

        legend.append('text')
            .attr('x', width + 220)
            .attr('y', 9.5)
            .attr('dy', '0.32em')
            .text(d => d)

    }

})
