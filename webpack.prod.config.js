'use strict';
/* global require, module */

var webpack = require('webpack');
var path = require('path');
var config = require('./webpack.config.js');


config.entry = [
    './app/static/js/app.js',
];

config.output = {
    path: path.resolve('./app/static/js/bundles/'),
    filename: 'bundle.min.js',
};

config.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production'),
        },
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'root.jQuery': 'jquery',
    }),
];

module.exports = config;
