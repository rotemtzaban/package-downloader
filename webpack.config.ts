import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

const isProd = process.env.NODE_ENV === 'production';

const config: webpack.Configuration = {
    devtool: 'source-map',
    entry: './src/index.tsx',
    mode: isProd ? 'production' : 'development',
    module: {
        rules: [
            {
                loader: 'ts-loader',
                test: /\.tsx?$/
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
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new CopyWebpackPlugin(['src/index.html'])
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDom'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    }
};

export default config;
