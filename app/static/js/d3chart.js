'use strict';

import d3 from 'd3';
import _ from 'underscore';


var d3MultiLineChart = {
    _margin: {
        top: 10,
        right: 130,
        bottom: 50,
        left: 130
    },

    create(el, props, series) {
        let svg = d3.select(el).append('svg')
            .attr('class', 'd3')
            .attr('width', props.width)
            .attr('height', props.height)
            .append('g')
            .attr('transform', `translate(${this._margin.left},${this._margin.top})`);

        let yAxisG = svg.append('g').attr('class', 'y axis');
        yAxisG.append('text')
            .attr('class', 'axis-label');

        svg.append('g').attr('class', 'x axis');
        svg.append('g').attr('class', 'lines');
        svg.append('g').attr('class', 'circles');

        this.update(el, series);
    },

    update(el, series) {
        let scales = this._scales(el, series);
        this._drawAxes(el, scales, series);
        this._drawLines(el, scales, series);
    },

    _scales(el, series) {
        let data = _.values(series);
        let width = el.offsetWidth - this._margin.right - this._margin.left;
        let height = el.offsetHeight - this._margin.top - this._margin.bottom;

        let minX = d3.min(data, d => { return d3.min(d, c => { return c.year; }); });
        let maxX = d3.max(data, d => { return d3.max(d, c => { return c.year; }); });

        let x = d3.scale.log()
            .range([0, width])
            .domain([
                1,
                maxX - minX + 1,
            ]);

        let y = d3.scale.linear()
            .range([height, 0])
            .domain([
                0,
                1.2 * d3.max(data, d => { return d3.max(d, c => { return c.value; }); }),
            ]);

        return {x: x, y: y, minX: minX, maxX: maxX};
    },

    _drawLines(el, scales, series) {
        let {x, y, minX, maxX} = scales;
        let color = d3.scale.category10().
            domain(_.keys(series));

        // Group data by year:
        let years = {};
        _.each(series, (values, key) => {
            values.map(d => {
                years[d.year] = years[d.year] || {year: d.year};
                years[d.year][key] = {value: d.value, type: d.type};
            });
        });
        years = _.sortBy(_.values(years), d => { return -d.year; });

        // Separate values and dashed values:
        let data = color.domain().map(key => {
            let values = [];
            let dashedValues = [];
            years.forEach(year => {
                let point = year[key];
                if (point) {
                    point.year = year.year;
                    // Dashed path starts where solid path ends:
                    if (point.type !== 'dashed') {
                        if (dashedValues.length > 0) {
                            dashedValues.push(point);
                        }
                        values.push(point);
                    } else {
                        dashedValues.push(point);
                    }
                }
            });

            return {
                key: key,
                values: values,
                dashedValues: dashedValues
            };
        });

        let line = d3.svg.line()
            .x(d => { return x(d.year - minX + 1); })
            .y(d => { return y(d.value); });

        let lineContainer = d3.select(el).selectAll('.lines');

        let lines = lineContainer.selectAll('.line')
            .data(data, d => { return d.key; });

        // ENTER
        lines.enter().append('path')
            .attr('class', 'line');

        // UPDATE
        lines.attr('d', d => { return line(d.values); })
            .style('stroke', d => { return color(d.key); });

        // REMOVE
        lines.exit().remove();


        let dashedLines = lineContainer.selectAll('.line.dashed')
            .data(data, d => { return d.key; });

        // ENTER
        dashedLines.enter().append('path')
            .attr('class', 'line dashed');

        // UPDATE
        dashedLines.attr('d', d => { return line(d.dashedValues); })
            .style('stroke', d => { return color(d.key); })
            .style('stroke-dasharray', '6 6');

        // REMOVE
        dashedLines.exit().remove();
    },

    _drawAxes(el, scales) {
        let {x, y, minX, minY} = scales;
        let width = el.offsetWidth - this._margin.left - this._margin.right;
        let height = el.offsetHeight - this._margin.top - this._margin.bottom;

        let xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(20, ",.1s")
            .tickFormat((d, i, b) => {
                return d + minX - 1;
            })
            .outerTickSize(0);

        let yAxis = d3.svg.axis()
            .scale(y)
            .ticks(4)
            .orient('left')
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(10);

        d3.select(el).select('.x.axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dy', '.3em')
            .attr('dx', '-.8em')
            .attr('transform', 'rotate(-60)');

        d3.select(el).select('.y.axis')
            .call(yAxis);

        d3.select(el).select('.y.axis .axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', '-100px')
            .attr('dx', -height / 2)
            .style('text-anchor', 'middle')
            .text('Emissions (tonnes CO2 equivalent)');
    },
};


export { d3MultiLineChart };
