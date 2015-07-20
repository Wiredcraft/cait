'use strict';
/* global google */

import React from 'react';
import _ from 'underscore';
import numeral from 'numeral';
import { Link } from 'react-router';
import Loader from 'react-loader';
import { Alert, PageHeader } from 'react-bootstrap';

import { APIClient } from 'apiclient.js';
import { GoogleLineChart } from 'components/chart.js';


var CompanyDetail = React.createClass({
    propTypes: {
        params: React.PropTypes.shape({
            companyId: React.PropTypes.string.isRequired,
        }).isRequired,
    },

    getInitialState() {
        return {
            companies: {},
            companyLoaded: false,
        };
    },

    componentDidMount() {
        this._fetchCompany(this.props.params.companyId);
        this._fetchCompany(12);
    },

    _fetchCompany(companyId) {
        this.setState({
            companyLoaded: false,
        });

        APIClient.getCompanyDetail(companyId)
            .done(resp => {
                let companies = this.state.companies;
                companies[companyId] = resp;
                this.setState({companies: companies});
            })
            .fail((xhr, textStatus, errorThrown) => {
                alert(`Failed to load company: ${errorThrown}`);
            })
            .always(() => {
                this.setState({companyLoaded: true});
            });
    },

    render() {
        let {companyLoaded, companies} = this.state;
        let active = companies[this.props.params.companyId];

        let content;
        if (active) {
            let emissionChart = <NoEmissionReportsMsg company={active} />;
            if (active.emission_reports.length > 0) {
                emissionChart = <EmissionChart companies={_.values(companies)} />;
            }

            content = (
                <div>
                    <PageHeader>
                        {active.name}
                        <small> {active.country}/{active.sector}/${active.revenue}bn</small>
                    </PageHeader>
                    {emissionChart}
                </div>
            );
        }

        return (
            <div className='container company-detail'>
                <Link to='companyList'>Back</Link>
                <Loader loaded={companyLoaded}>
                    {content}
                </Loader>
            </div>
        );
    }
});


var NoEmissionReportsMsg  = React.createClass({
    propTypes: {
        company: React.PropTypes.object.isRequired,
    },

    render () {
        return (
            <Alert bsStyle='warning'>
                {this.props.company.name} has no emission reports.
            </Alert>
        );
    }
});


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
            data = _.reduce(_.rest(dataTables), (combined, table) => {
                return google.visualization.data.join(combined, table, 'full', [[0, 0]], [1,2,3,4], [1,2,3,4]);
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
            <div>
                <GoogleLineChart data={data} options={options} />
            </div>
        );
    }
});


export { CompanyDetail };
