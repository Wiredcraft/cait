'use strict';

import React from 'react';
import _ from 'underscore';

import { Alert, Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import Loader from 'react-loader';

import { APIClient } from 'apiclient.js';
import { EmissionChart } from './emission-chart.js';
import { CompanyAccordion } from './company-accordion.js';


var Companies = React.createClass({
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

    _handleDeselect(companyId) {
        let updatedCompanies = this.state.companies.map(c => {
            c.selected = c.id === companyId ? false : c.selected;
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

        let emissionChart = selectedCompanies.length === 0 ? (
            <NoCompaniesSelectedMsg />
        ) : (
            <EmissionChart
                companies={selectedCompanies}
            />
        );

        return (
            <div className='container company-detail'>
                <b>Select companies to compare: </b>
                <Loader loaded={chartLoaded}>
                    <Grid>
                        <Row>
                            <Col xs={12} sm={8} md={9}>
                                <CompanyCompareSelect
                                    companies={companies}
                                    onChange={this._handleCompareChange}
                                />
                                {emissionChart}
                            </Col>
                            <Col xs={12} sm={4} md={3}>
                                <CompanyAccordion
                                    companies={selectedCompanies}
                                    onDeselect={this._handleDeselect}
                                />
                            </Col>
                        </Row>
                    </Grid>

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


var NoCompaniesSelectedMsg = React.createClass({
    render () {
        return (
            <div>
                <hr />
                <Alert bsStyle='warning'>
                    <bold>No companies selected!</bold>
                    <span> Choose a few using the field above
                        <Glyphicon glyph='hand-up' />
                    </span>
                </Alert>
            </div>
        );
    }
});


export { Companies };
