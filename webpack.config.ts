import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';

const isProd = process.env.NODE_ENV === 'production';

const config: webpack.Configuration = {
    devtool: 'source-map',
    entry: {
        browser: './browser/index.tsx',
        sw: './sw/index.ts'
    },
    mode: isProd ? 'production' : 'development',
    module: {
        rules: [
            {
                loader: 'ts-loader',
                test: /\.tsx?$/,
                include: path.join(__dirname, 'browser'),
                options:{
                    instance:'browser',
                    configFile:path.join(__dirname, 'browser', 'tsconfig.json')
                }
            },
            {
                loader: 'ts-loader',
                test: /\.tsx?$/,
                include: path.join(__dirname, 'sw'),
                options:{
                    instance:'sw',
                    configFile:path.join(__dirname, 'sw', 'tsconfig.json')
                }
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new CopyWebpackPlugin(['browser/index.html', 'content'])
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    }
};

export default config;
