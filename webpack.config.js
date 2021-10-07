// Production config

const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const cssLoaders = ext => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {}
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
        path: path.resolve(__dirname, "dist"),
        filename: "assets/js/sdk.min.js",
        library: 'SDK'
    },
    mode: process.env.NODE_ENV, // production
    optimization: {
        // splitChunks: {
        //     chunks: 'all',
        // },
    },
    plugins: [
        new Dotenv({
            path: '.env'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'assets/css/sdk.css'
        }),
        new CopyPlugin({
            patterns: [
                {from: 'public', to: path.resolve(__dirname, "dist")}
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
        extensions: [".tsx", ".ts", ".js", ".png", ".css"]
    }
};
