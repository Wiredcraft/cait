'use strict';
/* global google */

import React from 'react';
import _ from 'underscore';
import numeral from 'numeral';

import { GoogleLineChart } from 'components/chart.js';


var EmissionChart  = React.createClass({
    propTypes: {
        companies: React.PropTypes.array.isRequired,
    },

    _formatEmission(num, company) {
        num = numeral(num).format('0.0a');
        return `${num} tonnes (${company.name})`;
    },

    render () {
        let {companies} = this.props;

        let dataTables = companies.map(company => {
            let data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', `Emissions - ${company.name}`);
            data.addColumn({type: 'string', role: 'tooltip'});
            data.addColumn('number', `Reduction target - ${company.name}`);
            data.addColumn({type: 'string', role: 'tooltip'});

            // Plot emission report data:
            company.emission_reports.forEach((e, i, arr) => {
                let emissions = e.emissions * 1e06;
                data.addRow([
                    new Date(e.year + ''),
                    emissions,
                    this._formatEmission(emissions, company),
                    i === arr.length - 1 ? emissions : null,
                    null,
                ]);
            });

            // Plot possible reduction target data:
            let target = _.first(company.reduction_targets);
            let baseEmissions = _.last(company.emission_reports).emissions;

            if (target) {
                target.milestones.forEach(ms => {
                    let emissions = (baseEmissions - ms.size * baseEmissions) * 1e06;
                    data.addRow([
                        new Date(ms.year + ''),
                        null,
                        null,
                        emissions,
                        this._formatEmission(emissions, company),
                    ]);
                });

                let emissions = (baseEmissions - target.size * baseEmissions) * 1e06;
                data.addRow([
                    new Date(target.final_year + ''),
                    null,
                    null,
                    emissions,
                    this._formatEmission(emissions, company),
                ]);
            }

            return data;
        });

        // Merge companies into a single dataTable:
        let data = dataTables[0];
        if (dataTables.length > 1) {
            data = _.reduce(_.rest(dataTables), (combined, newTable, i) => {
                return google.visualization.data.join(
                    combined,
                    newTable,
                    'full',
                    [[0, 0]],
                    _.range(1, 5 + i * 4),
                    [1,2,3,4]
                );
            }, dataTables[0]);
        }

        // Set chart options & formatting:
        let series = {};
        companies.forEach((c, i) => {
            series[i*2 + 1] = {lineDashStyle: [6, 6], visibleInLegend: false};
        });

        let options = {
            title: 'Emissions per year',
            vAxis: { title: 'Emissions (tonnes CO2 equivalent)' },
            interpolateNulls: true,
            series: series,
        };

        let dateFormatter = new google.visualization.DateFormat({
            pattern: 'y',
        });
        dateFormatter.format(data, 0);

        return (
            <GoogleLineChart data={data} options={options} />
        );
    }
});


export { EmissionChart };
