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
            "_": "underscore",
            "React": "react",
            "ReactDOM": "react-dom"
        }),
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        })
    ]
};