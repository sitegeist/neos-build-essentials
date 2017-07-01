const glob = require('glob');

const createBuildJavaScriptForSitePackage = require('./build-javascript-for-site-package');

module.exports = ({logger, resolveLocalConfiguration, resolveLookupPaths, argv}, watch = false) => {
	logger.header('Build JavaScript');

	logger.info('Loading Neos CMS site packages...');

	if (watch) {
		logger.info('(Pro Tip: If you add another site package, you need to restart this watch task)');
	}

	const sitePackagePaths = glob.sync('Packages/Sites/*');

	if (!sitePackagePaths || !sitePackagePaths.length) {
		logger.warning('Looks like there are no site packages in your distribution. You should come back later ;)');
		return;
	}

	const buildJavaScriptForSitePackage = createBuildJavaScriptForSitePackage({
		logger,
		watch,
		resolveLocalConfiguration,
		resolveLookupPaths,
		argv
	});

	return Promise.all(
		sitePackagePaths.map(
			sitePackagePath => buildJavaScriptForSitePackage(sitePackagePath.split('/').slice(-1)[0])
		)
	);
};