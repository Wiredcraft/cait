'use strict';
/* global require, module */

var webpack = require('webpack');
var path = require('path');


module.exports = {
    entry: [
        'webpack/hot/only-dev-server',
        './app/static/js/app.js',
    ],
    output: {
        path: path.resolve('./app/static/js/bundles/'),
        filename: 'bundle.js',
        publicPath: 'http://0.0.0.0:8080/assets/',
    },
    module: {
        loaders: [
            { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.css$/, loader: 'style!css!autoprefixer-loader' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
        ],
    },
    node: {
        net: 'empty',
        tls: 'empty',
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery',
        }),
    ],
    resolve: {
        root: path.resolve('./app/static/js'),
        extensions: ['', '.js'],
    },
};
