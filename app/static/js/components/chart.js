'use strict';
/* global google */


import React from 'react';
import _ from 'underscore';

import { WindowResizeMixin } from 'mixins.js';


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
            backgroundColor: {fill: 'transparent'},
            explorer: null,
            focusTarget: 'category',
            width: '100%',
            legend: {position: 'bottom'},
            hAxis: {format: 'y', gridlines: {color: 'transparent'}, baselineColor: 'transparent'},
            vAxis: {baselineColor: 'transparent'},
            height: 400,
        };

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


export { GoogleLineChart };
