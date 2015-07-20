'use strict';

import React from 'react';
import _ from 'underscore';
import { Link } from 'react-router';
import Loader from 'react-loader';

import { APIClient } from 'apiclient.js';
import { LineChart } from 'components/chart.js';


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
            content = (
                <div>
                    {company.name} {company.country} {company.revenue}
                    <EmissionChart company={company} />
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


var EmissionChart  = React.createClass({
    propTypes: {
        company: React.PropTypes.object.isRequired,
    },

    render () {
        let {company} = this.props;

        let columns = [['year'], ['historical emissions']];
        company.emission_reports.forEach(e => {
            columns[0].push(e.year);
            columns[1].push(e.emissions);
        });

        let params = {
            axis: {
                x: { label: 'Year' },
                y: { label: 'Emissions (tonnes CO2 equivalent)' },
            },
            data: {
                x: 'year',
                columns: columns,
            },
        };

        return (
            <LineChart params={params} />
        );
    }
});


export { CompanyDetail };
