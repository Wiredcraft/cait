/* global google */

import React from 'react';
import _ from 'underscore';
import numeral from 'numeral';
import chroma from 'chroma-js';

import LineChart from 'components/line-chart.js';


const EmissionChart = React.createClass({
    propTypes: {
        companies: React.PropTypes.array.isRequired,
    },

    _formatEmission(num) {
        num = numeral(num).format('0.0a');
        return `${num} tonnes`;
    },

    render() {
        let {companies} = this.props;

        let dataTables = companies.map(company => {
            let data = new google.visualization.DataTable();
            data.addColumn('number', 'Year');
            data.addColumn('number', company.name);
            data.addColumn({type: 'string', role: 'tooltip'});
            data.addColumn('number', `${company.name} - Reduction target`);
            data.addColumn({type: 'string', role: 'tooltip'});

            // Plot emission report data:
            company.emission_reports.forEach((e, i, arr) => {
                let emissions = e.emissions * 1e06;
                data.addRow([
                    e.year,
                    emissions,
                    this._formatEmission(emissions),
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
                        ms.year,
                        null,
                        null,
                        emissions,
                        this._formatEmission(emissions),
                    ]);
                });

                let emissions = (baseEmissions - target.size * baseEmissions) * 1e06;
                data.addRow([
                    target.final_year,
                    null,
                    null,
                    emissions,
                    this._formatEmission(emissions),
                ]);
            }

            return data;
        });

        // Merge companies into a single dataTable:
        let data = dataTables[0];
        if (dataTables.length > 1) {
            let numberOfCols = data.getNumberOfColumns();

            data = _.reduce(_.rest(dataTables), (combined, newTable, i) => {
                return google.visualization.data.join(
                    combined,
                    newTable,
                    'full',
                    [[0, 0]],
                    _.range(1, numberOfCols + i * (numberOfCols - 1)),
                    _.range(1, numberOfCols)
                );
            }, dataTables[0]);
        }

        // Set chart options & formatting:
        let series = {};
        companies.forEach((c, i) => {
            series[i * 2] = {
                color: chroma.brewer.Set1[i],
            };
            series[i * 2 + 1] = {
                color: chroma.brewer.Set1[i],
                lineDashStyle: [6, 6],
                visibleInLegend: false,
            };
        });

        let options = {
            title: 'Emissions per year',
            vAxis: { title: 'Emissions (tonnes CO2 equivalent)' },
            hAxis: { format: '####' },
            interpolateNulls: true,
            series: series,
            pointSize: 0.5,
        };

        return (
            <div>
                <LineChart data={data} options={options} />
            </div>
        );
    },
});


export default EmissionChart;
