# insert-cdn-webpack-plugin

一个可以通过配置动态插入cdn链接到index.html的webpack插件(webpack 4+).

*依赖webpack的[externals](https://webpack.js.org/configuration/externals/)配置项，请升级webpack到4.0+*

```
$ npm install copy-webpack-plugin --save-dev
```

## Getting Started
**webpack.config.js**
配置如下
```
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new InsertCDNWebpackPlugin({
      cdnMap: {
        lodash: 'https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js'
      },
      excludeExternals: ['jquery']
    })
  ],
  externals: {
    "lodash": "_",
    "jquery": 'jQuery'
  }
};
```
> `externals`配置项：https://webpack.js.org/configuration/externals

> **如果同时配置了HtmlWebpackPlugin，需要把InsertCDNWebpackPlugin放在其后面**

```diff
<!doctype html>
<html>
<head>
...
  <!-- insert cdn begin-->
  <script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js"></script>
  <!-- insert cdn end-->
</head>
...
```
## Options
```
module.exports = {
  plugins: [
		new InsertCDNWebpackPlugin(options)
	],
};
```
#### options
Name | Type | Default | 
--- | --- | --- | 
`cdnMap` | `{Object}` | `{}` | 
`excludeExternals` | `{Array}` | `[]` | 