'use strict';
/* global google */

import '../css/style.css';
import 'react-select/dist/default.css';
import 'bootstrap-webpack';

import React from 'react';
import $ from 'jquery';
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


function startRenderingApp() {
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
}

// Load Google Charts libs before rendering:
var options = {
    dataType: 'script',
    cache: true,
    url: 'https://www.google.com/jsapi',
};
$.ajax(options).done(function(){
    google.load('visualization', '1', {
        packages: ['corechart'],
        callback: function() {
            startRenderingApp();
        }
    });
});
