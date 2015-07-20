'use strict';
/* global google */

import React from 'react';
import _ from 'underscore';
import { Link } from 'react-router';
import Loader from 'react-loader';
import { Alert, PageHeader } from 'react-bootstrap';

import { APIClient } from 'apiclient.js';
import { LineChart, GoogleLineChart } from 'components/chart.js';


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

        let data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Emissions (tonnes CO2 equivalent)');
        data.addColumn({type:'boolean',role:'certainty'});

        // Plot emission report data:
        company.emission_reports.forEach(e => {
            data.addRow([new Date(e.year + ''), e.emissions, true]);
        });

        // Plot possible reduction target data:
        let target = _.first(company.reduction_targets);
        let baseEmissions = _.last(company.emission_reports).emissions;

        if (target) {
            target.milestones.forEach(ms => {
                let msEmissions = baseEmissions - ms.size * baseEmissions;
                data.addRow([new Date(ms.year + ''), msEmissions, false]);
            });

            let finalEmissions = baseEmissions - target.size * baseEmissions;
            data.addRow([new Date(target.final_year + ''), finalEmissions, false]);
        }

        // Set chart options & formatting:
        let options = {
            title: 'Emissions per year',
        };

        let dateFormatter = new google.visualization.DateFormat({
            pattern: 'y',
        });
        dateFormatter.format(data, 0);

        let numFormatter = new google.visualization.NumberFormat({
            fractionDigits: 2,
            suffix: ''
        });
        numFormatter.format(data, 1);

        return (
            <div>
                <GoogleLineChart data={data} options={options} />
            </div>
        );
    }
});


export { CompanyDetail };
