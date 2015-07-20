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
            company: null,
            companyLoaded: false,
        };
    },

    componentDidMount() {
        this._fetchCompany();
    },

    _fetchCompany() {
        this.setState({
            companyLoaded: false,
        });

        APIClient.getCompanyDetail(this.props.params.companyId)
            .done(resp => {
                this.setState({company: resp});
            })
            .fail((xhr, textStatus, errorThrown) => {
                alert(`Failed to load company: ${errorThrown}`);
            })
            .always(() => {
                this.setState({companyLoaded: true});
            });
    },

    render() {
        let {companyLoaded, company} = this.state;

        let content;
        if (company !== null) {
            let emissionChart = <NoEmissionReportsMsg company={company} />;
            if (company.emission_reports.length > 0) {
                emissionChart = <EmissionChart company={company} />;
            }

            content = (
                <div>
                    <PageHeader>
                        {company.name}
                        <small> {company.country}/{company.sector}/${company.revenue}bn</small>
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
        company: React.PropTypes.object.isRequired,
    },

    _formatEmissionNum(num) {
        return numeral(num).format('0.0a') + ' tonnes';
    },

    render () {
        let {company} = this.props;

        let data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Emissions');
        data.addColumn({type: 'string', role: 'tooltip'});
        data.addColumn('number', 'Reduction target');
        data.addColumn({type: 'string', role: 'tooltip'});

        // Plot emission report data:
        company.emission_reports.forEach((e, i, arr) => {
            let emissions = e.emissions * 1e06;
            data.addRow([
                new Date(e.year + ''),
                emissions,
                this._formatEmissionNum(emissions),
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
                    this._formatEmissionNum(emissions),
                ]);
            });

            let emissions = (baseEmissions - target.size * baseEmissions) * 1e06;
            data.addRow([
                new Date(target.final_year + ''),
                null,
                null,
                emissions,
                this._formatEmissionNum(emissions),
            ]);
        }

        // Set chart options & formatting:
        let options = {
            title: 'Emissions per year',
            vAxis: { title: 'Emissions (tonnes CO2 equivalent)' },
            series: {
                0: {color: '#E34F64'},
                1: {color: '#5582B9', lineDashStyle: [6, 6]},
            },
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
