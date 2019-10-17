const getLogger = require('webpack-log');

class InsertCDNWebpackPlugin {
	constructor(options) {
		const userOptions = options || {};

		// Default options
		const defaultOptions = {
			cdnMap: {},
			excludeExternals: []
		};

		this.options = Object.assign(defaultOptions, userOptions);
	}

	apply(compiler) {

		const logger = getLogger({
			name: 'insert-cdn-webpack-plugin',
			// level: this.options.logLevel || 'warn',
			level: 'trace',
		});

		compiler.hooks.emit.tapAsync(
			"InsertCDNWebpackPlugin",
			(compilation, callback) => {
				/* 暂时只支持
				 * 
				 * externals: {
				 * 	"lodash": "_",
				 * 	"jquery": 'jQuery'
				 * }
				 * 
				 */
				const userExternals = compilation.options.externals

				const cdnArr = []
				!userExternals && logger.warn(`this plugin needs externals but got a ${userExternals}`);
				for (var ex in userExternals) {
					if (this.options.cdnMap[ex]) !this.options.excludeExternals.includes(ex) && cdnArr.push(this.options.cdnMap[ex])
					else logger.warn(`the '${ex}' cdn src is disappearance`);
				}

				// 获取htmlWebpackPlugin的配置项
				const htmlWebpackPluginOptions = compilation.options.plugins.find(({ __proto__ }) => {
					return __proto__.hasOwnProperty('htmlWebpackPluginAssets')
				})

				// 获取最终输出 html路径
				const indexTemplate = htmlWebpackPluginOptions
					? htmlWebpackPluginOptions.childCompilationOutputName || childCompilationOutputName.options.filename
					: 'index.html'

				const html = compilation.assets[indexTemplate].source()
				const headRegExp = /(<\/head\s*>)/i;
				const cdnString = cdnArr.map(src => `\t<script src=\"${src}\"></script>\n`).join('').replace(/\n$/, '')

				compilation.assets["index.html"] = {
					...compilation.assets["index.html"],
					source: () => {
						return html.replace(headRegExp,
`	<!-- insert cdn begin-->
${cdnString}
	<!-- insert cdn end-->
</head>`
						)
					},
				};
				callback();
			}
		);
	}
}


module.exports = InsertCDNWebpackPlugin;