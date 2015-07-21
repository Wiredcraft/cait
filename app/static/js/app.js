'use strict';
/* global google */

import '../css/style.css';
import 'react-select/dist/default.css';
import 'bootstrap-webpack';

import React from 'react';
import $ from 'jquery';
import { Navbar } from 'react-bootstrap';

import { Companies } from 'components/companies.js';


let App = React.createClass({
    render() {
        return (
            <div>
                <Navbar brand='CAIT Business proto' fluid={true} />
                <Companies />
            </div>
        );
    }
});


// Load Google Charts libs before rendering:
var options = {
    dataType: 'script',
    cache: true,
    url: 'https://www.google.com/jsapi',
};
$.ajax(options).done(function(){
    google.load('visualization', '1', {
        packages: ['corechart'],
        callback() {
            React.render(<App />, document.getElementById('react'));
        },
    });
});
