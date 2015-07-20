'use strict';

import React from 'react';
import Loader from 'react-loader';

import { APIClient } from 'apiclient.js';


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
                </div>
            );
        }

        return (
            <div className='container company-detail'>
                <Loader loaded={companyLoaded}>
                    {content}
                </Loader>
            </div>
        );
    }
});


export { CompanyDetail };
