require("dotenv").config({});

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    return {
        entry: ["./src/index.ts"],
        module: {
            rules: [
                {
                    test: /\.(tsx|ts|js|jsx)$/,
                    loader: "string-replace-loader",
                    options: {
                        search: /YOUR_API_KEY/g,
                        replace: process.env.GOOGLE_MAPS_API_KEY,
                    },
                },
                {
                    test: /\.js$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [["@babel/preset-env", { targets: "defaults" }]],
                        },
                    },
                },
                {
                    test: /\.tsx?$/i,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        compilerOptions: {
                            jsx: "react",
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    exclude: /node_modules/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        output: {
            path: `${__dirname}/public`,
            publicPath: "/",
            filename: "index.js",
            libraryTarget: "window",
        },
        plugins: [].concat(
            env.SKIP_HTML
                ? []
                : [
                      new HtmlWebpackPlugin({
                          template: "src/login.html",
                          filename: "login.html",
                        
                      }),
                      new HtmlWebpackPlugin({
                          template: "src/index.html",
                          inject: false,
                      }),
                      new HtmlReplaceWebpackPlugin([
                          {
                              pattern: /YOUR_API_KEY/g,
                              replacement: process.env.GOOGLE_MAPS_API_KEY,
                          },
                      ]),

                      new HtmlWebpackPlugin({
                          template: "src/about.html",
                          filename: "about.html",
                      }),
                      new HtmlWebpackPlugin({
                          template: "src/contact.html",
                          filename: "contact.html",
                      }),
                      new MiniCssExtractPlugin({
                          filename: "style.css",
                      })
                  ]
        ),
        devServer: {
            liveReload: true,
            host: "0.0.0.0",
            hot: false,
        },
        externals: {
            // use cdn version of ThreeJS to avoid tree shaking complexity
            three: "THREE",
        },
    };
};
