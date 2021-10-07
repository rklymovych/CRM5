const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

console.log('isDev', isDev);

const cssLoaders = ext => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {},
        },
        'css-loader?url=false'
    ];
    if (ext) {
        loaders.push(ext);
    }
    return loaders
}

module.exports = {
    entry: "./sdk/Bootstrap.ts",
    output: {
        filename: "sdk.min.js",
        path: path.resolve(__dirname, "dev/assets/js"),
        library: 'SDK'
    },
    mode: process.env.NODE_ENV,
    devtool: "cheap-module-source-map",
    devServer: {
        port: 4000,
        contentBase: path.join(__dirname, './dev'),
        publicPath:  '/assets/js/',
        inline: false,
        watchContentBase: true,
    },
    optimization: {
        // splitChunks: {
        //     chunks: 'all',
        // },
    },
    plugins: [
        new Dotenv({
            path: '.env.develop',
        }),
        new MiniCssExtractPlugin({
            filename: '../css/sdk.css'
        }),
        new CopyPlugin({
            patterns: [
                {from: 'public', to: path.resolve(__dirname, "dev")}
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.png', '.css']
    }
};
