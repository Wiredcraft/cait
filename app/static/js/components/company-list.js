'use strict';

import React from 'react';
import Loader from 'react-loader';
import { Link } from 'react-router';
import { Input, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap';

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

    _handleFilterChange(filterBy, val) {
        this.setState({
            companies: this.state.companies.map(c => {
                c.hidden = val && !c[filterBy].toLowerCase().startsWith(val);
                return c;
            }),
        });
    },

    render() {
        let {companies, companiesLoaded} = this.state;

        return (
            <div className='container companies'>
                <b>Companies:</b>
                <Loader loaded={companiesLoaded}>
                    <CompanyFilter onChange={this._handleFilterChange} />
                    <ListGroup>
                        {companies.filter(c => {
                            return !c.hidden;
                        }).map(c => {
                            return <CompanyListItem company={c} key={c.id} />;
                        })}
                    </ListGroup>
                </Loader>
            </div>
        );
    }
});


/* A simple filter component with an input and a filter type selector. */
var CompanyFilter = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            filterBy: 'name',
            inputVal: '',
        };
    },

    _handleInputChange(e) {
        this.setState({
            inputVal: e.target.value,
        });
        this.props.onChange(this.state.filterBy, e.target.value.trim());
    },

    _handleTypeChange(newType) {
        this.setState({
            filterBy: newType,
            inputVal: '',
        });

        this.props.onChange(newType, '');
    },

    render() {
        let {filterBy, inputVal} = this.state;
        let filterTypes = ['name', 'country', 'sector'];

        let typeSelect = (
            <DropdownButton title={filterBy}>
                {filterTypes.map(f => {
                    return (
                        <MenuItem
                            key={f}
                            eventKey={f}
                            active={f === filterBy}
                            onSelect={this._handleTypeChange}>
                            {f}
                        </MenuItem>
                    );
                })}
            </DropdownButton>
        );

        return (
            <div>
                <Input
                    type='text'
                    placeholder='Filter companies'
                    ref='input'
                    buttonAfter={typeSelect}
                    value={inputVal}
                    onChange={this._handleInputChange} />
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
                    {c.country}/{c.sector}/${c.revenue}bn
                </ListGroupItem>
            </Link>
        );
    }
});


export { CompanyList };
