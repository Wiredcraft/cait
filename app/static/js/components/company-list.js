'use strict';

import React from 'react';
import Loader from 'react-loader';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import { APIClient } from 'apiclient.js';


var CompanyList = React.createClass({
    getInitialState() {
        return {
            companies: [],
            companiesLoaded: false,
        };
    },

    componentDidMount() {
        this._fetchCompanies();
    },

    _fetchCompanies() {
        this.setState({
            companiesLoaded: false,
        });

        APIClient.getCompanies()
            .done(resp => {
                this.setState({companies: resp.data});
            })
            .fail((xhr, textStatus, errorThrown) => {
                alert(`Failed to load companies: ${errorThrown}`);
            })
            .always(() => {
                this.setState({companiesLoaded: true});
            });
    },

    render() {
        let {companies, companiesLoaded} = this.state;

        return (
            <div className='container companies'>
                <b>Companies:</b>
                <Loader loaded={companiesLoaded}>
                    <ListGroup>
                        {companies.map(c => {
                            return <CompanyListItem company={c} key={c.id} />;
                        })}
                    </ListGroup>
                </Loader>
            </div>
        );
    }
});


var CompanyListItem = React.createClass({
    propTypes: {
        company: React.PropTypes.object.isRequired,
    },

    render() {
        let c = this.props.company;

        return (
            <Link to='companyDetail' params={{companyId: c.id}}>
                <ListGroupItem header={c.name}>
                    {c.revenue} {c.country} {c.sector}
                </ListGroupItem>
            </Link>
        );
    }
});


export { CompanyList };
