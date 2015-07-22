'use strict';
/* global google */

import React from 'react';
import $ from 'jquery';
import _ from 'underscore';

import { d3MultiLineChart } from 'd3chart.js';
import { WindowResizeMixin } from 'mixins.js';


var MultiLineChart  = React.createClass({
    propTypes: {
        series: React.PropTypes.object,
        height: React.PropTypes.number,
        title: React.PropTypes.string,
    },

    mixins: [WindowResizeMixin],

    getDefaultProps() {
        return {
            series: {},
            height: 320,
            title: '',
        };
    },

    componentDidMount() {
        var el = this.getDOMNode();

        d3MultiLineChart.create(el, {
            width: $(el).width(),
            height: this.props.height,
            title: this.props.title,
        }, this.props.series);
    },

    componentDidUpdate() {
        var el = this.getDOMNode();
        d3MultiLineChart.update(el, this.props.series);
    },

    render () {
        return (
            <div className='chart' />
        );
    },
});


var GoogleLineChart  = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        options: React.PropTypes.object.isRequired,
    },

    mixins: [WindowResizeMixin],

    componentDidMount() {
        this._drawChart(this.props.data, this.props.options);
    },

    componentWillReceiveProps(nextProps) {
        this._drawChart(nextProps.data, nextProps.options);
    },

    _drawChart(data, options) {
        let target = this.refs.chart.getDOMNode();
        let chart = new google.visualization.LineChart(target);
        chart.draw(data, this._getChartOptions(options));
    },

    _getChartOptions(options) {
        var defaultOpts = {
            width: '100%',
            backgroundColor: {fill: 'transparent'},
            focusTarget: 'category',
            legend: {position: 'bottom'},
            vAxis: {baselineColor: 'transparent'},
            hAxis: {gridlines: {color: 'transparent'}, baselineColor: 'transparent'},
            height: 400,
        };

        options.vAxis = _.extend(defaultOpts.vAxis, options.vAxis || {});
        options.hAxis = _.extend(defaultOpts.hAxis, options.hAxis || {});

        return _.extend(defaultOpts, options);
    },

    _handleResize() {
        this._drawChart(this.props.data, this.props.options);
    },

    render () {
        return (
            <div ref='chart' />
        );
    }
});


export { GoogleLineChart, MultiLineChart };
