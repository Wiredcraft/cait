'use strict';

import React from 'react';
import _ from 'underscore';
import { Link } from 'react-router';
import Loader from 'react-loader';
import { Alert, PageHeader } from 'react-bootstrap';

import { APIClient } from 'apiclient.js';
import { LineChart, DyLineChart } from 'components/chart.js';


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

    render () {
        let {company} = this.props;

        let columns = [['year'], ['emissions']];

        company.emission_reports.forEach(e => {
            columns[0].push(e.year);
            columns[1].push(e.emissions);
        });

        let target = _.first(company.reduction_targets);
        let baseEmissions = _.last(company.emission_reports).emissions;

        if (target) {
            columns.push(columns[0].map((c, i) => {
                return i === 0 ? 'target' : null;
            }));

            columns[0].push(_.last(columns[0]));
            columns[2].push(_.last(columns[1]));

            target.milestones.forEach(ms => {
                columns[0].push(ms.year);
                columns[1].push(null);
                columns[2].push(baseEmissions - ms.size * baseEmissions);
            });

            columns[0].push(target.final_year);
            columns[1].push(null);
            columns[2].push(baseEmissions - target.size * baseEmissions);
        }

        let params = {
            axis: {
                x: {label: 'Year'},
                y: {label: 'Emissions (tonnes CO2 equivalent)'},
            },
            data: {
                x: 'year',
                columns: columns,
            },
        };

        return (
            <div>
                <LineChart params={params} />
            </div>
        );
    }
});


export { CompanyDetail };
