const webpack = require('webpack')
const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports ={
  entry: './src/client/index.js',
  mode: 'development',
  devtool: 'source-map',
  stats: 'verbose',
  output: {
    libraryTarget:'var',
    library:'Client'
  },
  module:{
    rules: [
      {
        test: '/\.js$',
        exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'img/'
                    }
                  },
                ],
              }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            
            dry: true,
            
            verbose: true,
            
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })
    ]
}
