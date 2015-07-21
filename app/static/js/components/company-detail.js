'use strict';

import React from 'react';
import _ from 'underscore';

import { PageHeader } from 'react-bootstrap';
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
            companies: [],
            chartLoaded: false,
        };
    },

    componentDidMount() {
        this._fetchCompanies();
    },

    _fetchCompanies() {
        this.setState({
            chartLoaded: false,
        });

        APIClient.getCompanies()
            .done(resp => {
                // Initially select the 1st company with emission data:
                let firstIdWithEmissionData = _.findIndex(resp.data, c => {
                    return c.emission_reports.length > 0;
                });

                resp.data[firstIdWithEmissionData].selected = true;

                this.setState({
                    companies: resp.data,
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
        let updatedCompanies = this.state.companies.map(c => {
            c.selected = _.contains(selectedIds, c.id);
            return c;
        });

        this.setState({
            companies: updatedCompanies,
        });
    },

    render() {
        let {chartLoaded, companies} = this.state;
        let selectedCompanies = companies.filter(c => {
            return c.selected;
        });

        return (
            <div className='container company-detail'>
                <PageHeader>
                    Compare companies
                </PageHeader>
                <Loader loaded={chartLoaded}>
                    <CompanyCompareSelect
                        companies={companies}
                        onChange={this._handleCompareChange}
                    />
                    <EmissionChart
                        companies={selectedCompanies}
                    />
                </Loader>
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
        this.props.onChange(value.split(',').map(val => {
            return parseInt(val);
        }));
    },

    shouldComponentUpdate: function() {
        return false;
    },

    render () {
        let options = this.props.companies.map(c => {
            return {
                value: c.id,
                label: c.name,
                disabled: c.emission_reports.length === 0,
            };
        });

        let value = this.props.companies.filter(c => {
            return c.selected;
        }).map(c => {
            return {value: c.id, label: c.name};
        });

        return (
            <Select
                options={options}
                value={value}
                multi={true}
                onChange={this._handleChange}
                searchable={true}
                placeholder='Compare with other companies'
            />
        );
    }
});


export { CompanyDetail };
