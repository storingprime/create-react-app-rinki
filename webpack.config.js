
// webpack rinki config

const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

// envs
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
// create templatename
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

// optimization
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

// loader
const cssLoaders = (...extras) => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        'css-loader'
    ]

    if (extras && extras.length > 0) {
        loaders.push(...extras)
    }

    return loaders
}
const babelLoader = (...presets) => {
    const loader = {
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-env'
            ]
        }
    }

    if (presets && presets.length > 0) {
        loader.options.presets.push(...presets)
    }

    return loader
}


// plugins
const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: '../public/index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: `${__dirname}/src/favicon.ico`,
                    to: `${__dirname}/build`
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ]

    return base
}

module.exports = {
    context: `${__dirname}/src`,
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
    },
    output: {
        filename: filename('js'),
        path: `${__dirname}/build`
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@components': `${__dirname}/src/components`,
            '@contexts': `${__dirname}/src/contexts`,
            '@styles': `${__dirname}/src/styles`,
            '@assets': `${__dirname}/assets`,
            '@': `${__dirname}/src`,
            '!': `${__dirname}/`,
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4500,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff2?|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [babelLoader()]
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [babelLoader('@babel/preset-typescript')]
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: [babelLoader('@babel/preset-react')]
            }
        ]
    }
}