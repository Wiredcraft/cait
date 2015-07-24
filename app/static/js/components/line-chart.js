/* global google */

import React from 'react';
import _ from 'underscore';

import { WindowResizeMixin } from 'mixins.js';


const LineChart = React.createClass({
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
        let defaultOpts = {
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

    render() {
        return (
            <div ref='chart' />
        );
    },
});


export default LineChart;
