'use strict';

import React from 'react';
import _ from 'underscore';

import { Link } from 'react-router';
import { Alert, PageHeader } from 'react-bootstrap';
import Select from 'react-select';
import Loader from 'react-loader';

import { APIClient } from 'apiclient.js';
import { EmissionChart } from 'components/emission-chart.js';


var CompanyDetail = React.createClass({
    propTypes: {
        params: React.PropTypes.shape({
            companyId: React.PropTypes.string.isRequired,
        }).isRequired,
    },

    getInitialState() {
        return {
            companies: {},
            chartLoaded: false,
        };
    },

    componentDidMount() {
        this._fetchCompanies();
    },

    _fetchCompanies(companyId) {
        this.setState({
            chartLoaded: false,
        });

        APIClient.getCompanies(companyId)
            .done(resp => {
                let companies = _.indexBy(resp.data, 'id');
                companies[this.props.params.companyId].isBaseCompany = true;

                this.setState({
                    companies: companies,
                });
            })
            .fail((xhr, textStatus, errorThrown) => {
                alert(`Failed to load company: ${errorThrown}`);
            })
            .always(() => {
                this.setState({chartLoaded: true});
            });
    },

    _handleCompareChange(selectedIds) {
        let companies = this.state.companies;
        _.each(companies, (company, companyId) => {
            companies[companyId].isCompared = _.contains(selectedIds, companyId);
        });

        this.setState({
            companies: companies,
        });
    },

    render() {
        let {chartLoaded, companies} = this.state;
        let active = companies[this.props.params.companyId];
        let content;

        if (active) {
            let compareSelect;
            let emissionChart = <NoEmissionReportsMsg company={active} />;

            if (active.emission_reports.length > 0) {
                let companiesInChart = _.values(companies).filter(c => {
                    return c.isCompared || c.isBaseCompany;
                });

                emissionChart = (
                    <div>
                        <EmissionChart companies={companiesInChart} />
                    </div>
                );

                compareSelect = (
                    <CompanyCompareSelect
                        companies={_.values(companies)}
                        onChange={this._handleCompareChange}
                    />
                );
            }

            content = (
                <div>
                    <PageHeader>
                        {active.name}
                        <small> {active.country}/{active.sector}/${active.revenue}bn</small>
                    </PageHeader>
                    <Loader loaded={chartLoaded}>
                        {compareSelect}
                        {emissionChart}
                    </Loader>
                </div>
            );
        }

        return (
            <div className='container company-detail'>
                <Link to='companyList'>Back</Link>
                {content}
            </div>
        );
    }
});


var CompanyCompareSelect  = React.createClass({
    propTypes: {
        companies: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
    },

    _handleChange(value) {
        this.props.onChange(value.split(','));
    },

    shouldComponentUpdate: function() {
        return false;
    },

    render () {
        let options = this.props.companies.filter(c => {
            return c.emission_reports.length > 0 && !c.isBaseCompany;
        }).map(c => {
            return {value: c.id, label: c.name};
        });

        return (
            <Select
                options={options}
                multi={true}
                onChange={this._handleChange}
                searchable={true}
                placeholder='Compare with other companies'
            />
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


export { CompanyDetail };
