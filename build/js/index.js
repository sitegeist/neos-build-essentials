const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const tmp = require('tmp');
const uuid = require('uuid');

const logger = require('../../logger');
const generateEntryFile = require('./generate-entry-file');

module.exports = () => {
	const sitePackages = glob.sync('Packages/Sites/*');

	const buildJsForSitePackage = sitePackage => {
		const tmpDir = tmp.dirSync();
		const tmpFile = path.join(tmpDir.name, sitePackage.split('/').slice(-1)[0], uuid.v4() + '.js');
		const components = glob.sync(path.join(sitePackage, 'Resources/Private/Fusion/**/Component.js'));
		const webpackConfig = {
			entry: {
				Main: tmpFile
			},
			output: {
				filename: '[name].js',
				path: path.join(process.cwd(), sitePackage, 'Resources/Public/JavaScript')
			},
			plugins: [
				new (function () {
					this.apply = compiler => {
						compiler.plugin('run', (_, done) => {
							generateEntryFile(tmpFile, components);
							done();
						});
					};
				})()
			]
		};

		//
		// Autogenerate bootstrap code
		//

		const compiler = webpack(webpackConfig);
		compiler.run((err, stats) => {
			logger.exit(`${process.env.npm_lifecycle_event} successfully completed :)`);
		});
	};

	sitePackages.forEach(buildJsForSitePackage);
};
