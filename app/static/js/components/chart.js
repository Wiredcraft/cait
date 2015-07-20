'use strict';

import React from 'react';
import _ from 'underscore';
import c3 from 'c3';


var LineChart  = React.createClass({
    propTypes: {
        params: React.PropTypes.object,
    },

    getDefaultProps() {
        return {
            params: {
                axis: {},
                data: {
                    columns: [],
                },
            },
        };
    },

    getInitialState: function() {
        return {
            chart: null,
        };
    },

    componentDidMount() {
        let chart = c3.generate(_.extend(this.props.params, {
            bindto: this.refs.chart.getDOMNode(),
        }));

        this.setState({
            chart: chart
        });
    },

    render () {
        return (
            <div ref='chart' />
        );
    }
});


export { LineChart };
