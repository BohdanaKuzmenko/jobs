var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        root: path.resolve('./src/'),
        extensions: ['', '.js']
    },
    entry: {
        main: './src/main.js'
    },
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
            "ReactDOM": "react-dom",
            "_": "underscore"
        })
    ]
};