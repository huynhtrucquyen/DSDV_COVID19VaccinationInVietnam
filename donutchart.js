var width = 370,
    height = 470;

var radius = Math.min(width, height) / 2;
var donutWidth = 80;
var innerRadius = radius - donutWidth;
var outerRadius = radius;
var outerRadiusFinal = radius * 1.06;
var legendRectSize = 18;
var legendSpacing = 4;
var pie = d3.pie()
    .value(function(d) {
        return d.count;
    })
    .sort(null);

// Tooltip 
var tooltip3 = d3.select('body').append('div')
    .attr('class', 'tooltip3');

tooltip3.append('div')
    .attr('class', 'label');
tooltip3.append('div')
    .attr('class', 'count');
tooltip3.append('div')
    .attr('class', 'percent');

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

// for animation
var arcFinal = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadiusFinal);

function visDonut() {
    // import { donut2 } from "./   donut2";
    var data = [{ label: 'Pfizer', count: 94324020 },
        { label: 'AstraZeneca', count: 65223076 },
        { label: 'Sinopharm', count: 52261200 },
        { label: 'Moderna', count: 14077160 },
        { label: 'Abdala', count: 5150000 },
        { label: 'Sputnik V', count: 1508998 },
        { label: 'Sputnik Light', count: 100000 }
    ];

    // // Set dimensions and append svg object to the body of the graph
    // var margin = { top: 30, bottom: 90, left: 110, right: 270 },


    var svg = d3.select('#donutchart')
        .append('svg')
        .attr('width', width + 350)
        .attr('height', height + 100)
        .style('border', '3px solid rgb(83, 198, 140)')
        .style('border-radius', '10px')
        .append('g')
        .attr('transform', 'translate(' + (width / 1.3) + ',' + (height / 1.5) + ')');
    svg.append("text").text('Total number of vaccines received')
        .attr("x", -150)
        .attr("y", -250)
        .style("font-size", "30px")
        .style("font-weight", "bold")


    var colorScale = d3.scaleOrdinal(['rgb(0, 102, 102)', 'rgb(51, 102, 153)', 'rgb(0, 153, 153)', 'rgb(102, 153, 153)', 'rgb(51, 153, 102)', 'rgb(0, 204, 102)', 'rgb(153, 204, 0)']);

    const pied = pie(data);
    // Draw the pie chart
    var path = svg.selectAll('g.slice')
        .data(pied, (d) => d.data.key)

    .enter()
        .append('svg:g')
        .attr('class', 'slice');
    // CLick here 
    path.on("click", function(d) {
        console.log("aa");
        console.log(d.data.label);
        donut2(d.data.label);

    });
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
                horz = legendRectSize + 250,
                vert = i * height - 150
            return 'translate(' + horz + ',' + vert + ')';
        });
    legend.append('circle')
        .attr('cx', legendRectSize)
        .attr('cy', legendRectSize - 9)
        .attr('r', 9)
        .style('fill', colorScale)

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing + 12)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) {
            return d;
        })
        .style("font-weight", "bold")
        .style("font-size", "17px")

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
        .attr('x', legendRectSize + legendSpacing - 11)
        .attr('y', legendRectSize - legendSpacing)
        .text((function(d) {
            return 'Total: ' + formatComma(total);
        }))
        .style("font-weight", "bold")
        .style("font-size", "21px")
}

var donut2_svg = d3.select('#donut2')
    .append('svg')
    .attr('width', width + 430)
    .attr('height', height + 100)
    .style('border', '3px solid rgb(83, 198, 140)')
    .style('border-radius', '10px')
    .append('g')
    .attr('transform', 'translate(' + (width / 1.3) + ',' + (height / 1.5) + ')')
donut2_svg.append("text").text('Sources of aid')
    .attr("x", 20)
    .attr("y", -250)
    .style("font-size", "30px")
    .style("font-weight", "bold")

var pie = d3.pie()
    .value(function(d) {
        return d.count;
    })
    .sort(null);
donut2_svg.append("text")
    .attr("text-anchor", "middle");
var line1_donut = donut2_svg.append("text")
    .attr("dy", "-1em")
    .attr("text-anchor", "middle");
var line2_donut = donut2_svg.append("text")
    .attr("dy", "2em")
    .attr("text-anchor", "middle");

var radius = Math.min(width, height) / 2;
var donutWidth = 80;
var innerRadius = radius - donutWidth;
var outerRadius = radius;
var outerRadiusFinal = radius * 1.06;
var legendRectSize = 18;
var legendSpacing = 4;

// console.log(donut2_path);
//console.log("AAAAAA");

function donut2(rowValue) {
    var colorScale = d3.scaleOrdinal(['rgb(0, 102, 153)', 'rgb(102, 153, 153)', 'rgb(0, 102, 102)', 'rgb(51, 153, 102)']);

    // donut2_svg = d3.select('#donut2').select('svg').selectAll().remove;
    // donut2_svg = d3.select('#donut2')
    var data = [{ label: 'state_budget', count: 31436236 },
        { label: 'covax', count: 13572980 },
        { label: 'governments_of_ountries', count: 20127460 },
        { label: 'corporate_sponsorship', count: 386400 }
    ];

    line1_donut.text(rowValue)
        .style("font-weight", "bold")
        .style("font-size", "22px")

    var formatComma = d3.format(',')
    var rowConverter = function(d) {
        return {
            type: d['type'],
            state_budget: parseInt(d['state_budget']),
            covax: parseInt(d['covax']),
            governments_of_ountries: parseInt(d['governments_of_ountries']),
            corporate_sponsorship: parseInt(d['corporate_sponsorship'])
        }
    }

    d3.csv('https://raw.githubusercontent.com/huynhtrucquyen/DSDV_COVID19VaccinationInVietnam/main/donut_data.csv', rowConverter, function(error, _data) {

        var data2;

        for (var i = 0; i < _data.length; i++) {
            if (_data[i]['type'] == rowValue) {
                data2 = _data[i]
                break;
            }
        }
        // console.log(data[0]["state_budget"]);


        for (var i = 0; i < 4; i++) {
            data[i].count = data2[data[i].label];
        }


        var total = d3.sum(data.map(function(d) {
            return d.count;

        }));
        line2_donut.text("Total: " + formatComma(total))
            .attr("y", -30)
            .style("font-weight", "bold")
            .style("font-size", "22px")


        // Tooltip 
        var tooltip3 = d3.select('body').append('div')
            .attr('class', 'tooltip3');

        tooltip3.append('div')
            .attr('class', 'label');

        tooltip3.append('div')
            .attr('class', 'count');

        tooltip3.append('div')
            .attr('class', 'percent');

        donut2_svg.selectAll('g.slice').remove();
        var donut2_path = donut2_svg.selectAll('g.slice')
            .data(pie(data))
            .enter()

        .append('svg:g')
            .attr('class', 'slice');

        donut2_path.append('svg:path').attr('d', arc)
            .attr('fill', function(d, i) {
                return colorScale(d.data.label);
            })
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        donut2_path.on('mouseover', function(d) {
            d3.select(this).select('path').transition()
                .duration(650)
                .attr('d', arcFinal);
            var percent = Math.round(1000 * d.data.count / total) / 10;
            tooltip3.select('.label').html(d.data.label);
            tooltip3.select('.count').html(formatComma(d.data.count));
            tooltip3.select('.percent').html(percent + '%');
            tooltip3.style('display', 'block');
        });

        donut2_path.on('mousemove', function(d) {
            tooltip3.style('top', (d3.event.pageY + 10) + 'px')
                .style('left', (d3.event.pageX + 10) + 'px');
        });

        donut2_path.on('mouseout', function() {
            d3.select(this).select('path').transition()
                .duration(650)
                .attr('d', arc);
            tooltip3.style('display', 'none');
        });

        var legend = donut2_svg.selectAll('.legend')
            .data(colorScale.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing,
                    horz = legendRectSize + 250,
                    vert = i * height - 150
                return 'translate(' + horz + ',' + vert + ')';
            });
        legend.append('circle')
            .attr('cx', legendRectSize - 5)
            .attr('cy', legendRectSize - 9)
            .attr('r', 8)
            .style('fill', colorScale)

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing + 5)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                if (d == 'state_budget')
                    return 'State Budget';
                if (d == 'covax')
                    return 'Covax';
                if (d == 'governments_of_ountries')
                    return 'Governments of Countries';
                if (d == 'corporate_sponsorship')
                    return 'Corporate Sponsorship';

            })
            .style("font-weight", "bold")
            .style("font-size", "18px")
    })
}
