var data = [{
        label: 'AstraZeneca',
        count: 65223076
    }, {
        label: 'Pfizer',
        count: 94324020
    }, {
        label: 'Sinopharm',
        count: 52261200
    }, {
        label: 'Moderna',
        count: 14077160
    }, {
        label: 'Abdala',
        count: 5150000
    }, {
        label: 'Sputnik V',
        count: 1508998
    }, {
        label: 'Sputnik Light',
        count: 100000
    }

];

// Set dimensions and append svg object to the body of the graph
var margin = { top: 30, bottom: 90, left: 110, right: 270 },
    width = 370,
    height = 370;

var svg = d3.select('#donutchart')
    .append('svg')
    .attr('width', width + 350)
    .attr('height', height + 120)
    .style('border', '3px solid rgb(83, 198, 140)')
    .style('border-radius', '15px')
    .append('g')
    .attr('transform', 'translate(' + (width / 1.3) + ',' + (height / 1.5) + ')');

var radius = Math.min(width, height) / 2;
var donutWidth = 80;
var innerRadius = radius - donutWidth;
var outerRadius = radius;
var outerRadiusFinal = radius * 1.06;
var legendRectSize = 18;
var legendSpacing = 4;

var colorScale = d3.scaleOrdinal(['rgb(51, 153, 102)', 'rgb(102, 153, 153)', 'rgb(0, 102, 102)', 'rgb(0, 204, 153)', 'rgb(0, 153, 153)', 'rgb(0, 204, 102)', 'rgb(153, 204, 0)']);

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

// for animation
var arcFinal = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadiusFinal);

var pie = d3.pie()
    .value(function(d) {
        return d.count;
    })
    .sort(null);

// Draw the pie chart
var path = svg.selectAll('g.slice')
    .data(pie(data))
    .enter()
    .append('svg:g')
    .attr('class', 'slice')

path.append('svg:path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
        return colorScale(d.data.label);
    })
    .attr('stroke', 'white')
    .style('stroke-width', '2px');

var total = d3.sum(data.map(function(d) {
    return d.count;
}));

var formatComma = d3.format(',')

// Tooltip 
var tooltip3 = d3.select('body').append('div')
    .attr('class', 'tooltip3');

tooltip3.append('div')
    .attr('class', 'label');

tooltip3.append('div')
    .attr('class', 'count');

tooltip3.append('div')
    .attr('class', 'percent');

// Tooltip and arc transition
path.on('mouseover', function(d) {
    d3.select(this).select('path').transition()
        .duration(650)
        .attr('d', arcFinal);
    var percent = Math.round(1000 * d.data.count / total) / 10;
    tooltip3.select('.label').html(d.data.label);
    tooltip3.select('.count').html(formatComma(d.data.count));
    tooltip3.select('.percent').html(percent + '%');
    tooltip3.style('display', 'block');
});

path.on('mousemove', function(d) {
    tooltip3.style('top', (d3.event.pageY + 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px');
});

path.on('mouseout', function() {
    d3.select(this).select('path').transition()
        .duration(650)
        .attr('d', arc);
    tooltip3.style('display', 'none');
});

var legend = svg.selectAll('.legend')
    .data(colorScale.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing,
            horz = legendRectSize + 220,
            vert = i * height - 150
        return 'translate(' + horz + ',' + vert + ')';
    });
legend.append('circle')
    .attr('cx', legendRectSize)
    .attr('cy', legendRectSize - 8)
    .attr('r', 8)
    .style('fill', colorScale)

legend.append('text')
    .attr('x', legendRectSize + legendSpacing + 10)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
        return d;
    });

var sum = [total]

var legend2 = svg.selectAll('.legend2')
    .data(sum)
    .enter()
    .append('g')
    .attr('class', 'legend2')
    .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing,
            horz = legendRectSize - 110,
            vert = i * height - 15
        return 'translate(' + horz + ',' + vert + ')';
    });
legend2.append('text')
    .attr('x', legendRectSize + legendSpacing + 10)
    .attr('y', legendRectSize - legendSpacing)
    .text((function(d) {
        return 'Total: ' + formatComma(total);
    }))
