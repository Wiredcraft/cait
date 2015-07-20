'use strict';

import '../css/style.css';
import 'c3/c3.css';
import 'bootstrap-webpack';

import React from 'react';
import Router from 'react-router';
import { Link, Route, RouteHandler, Redirect } from 'react-router';
import { Navbar } from 'react-bootstrap';

import { CompanyList } from 'components/company-list.js';
import { CompanyDetail } from 'components/company-detail.js';


let App = React.createClass({
    render() {
        return (
            <div>
                <AppNavbar />
                <RouteHandler/>
            </div>
        );
    }
});


var AppNavbar = React.createClass({
    render () {
        let brand = (
            <Link to='companyList'>CAIT Business proto</Link>
        );

        return (
            <Navbar brand={brand} fluid={true} />
        );
    }
});


let routes = (
    <Route name='app' path='/' handler={App}>
        <Redirect from='/' to='companyList' />
        <Route name='companyList' path='/companies' handler={CompanyList} />
        <Route name='companyDetail' path='/companies/:companyId' handler={CompanyDetail} />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('react'));
});
