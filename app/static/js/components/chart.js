'use strict';
/* global google */


import React from 'react';
import _ from 'underscore';


var GoogleLineChart  = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        options: React.PropTypes.object,
    },

    getDefaultProps() {
        return {
            data: [],
            options: {},
        };
    },

    getInitialState() {
        return {
            chart: null,
        };
    },

    componentDidMount() {
        let target = this.refs.chart.getDOMNode();
        let chart = new google.visualization.LineChart(target);
        chart.draw(this.props.data, this._getChartOptions());

        this.setState({
            chart: chart
        });
    },

    _getChartOptions() {
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

        return _.extend(defaultOpts, this.props.options);
    },

    render () {
        return (
            <div ref='chart' />
        );
    }
});


export { GoogleLineChart };
