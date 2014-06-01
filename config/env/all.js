'use strict';

module.exports = {
	app: {
		title: 'Entrecote',
		description: 'Entrecote',
		keywords: 'Entrecote'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				// 'public/lib/bootstrap/dist/css/bootstrap.css',
				// 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/blue-moonV1.0.3/css/bootstrap.css',
                'public/blue-moonV1.0.3/css/new.css',
                'public/lib/ng-grid/ng-grid.css',
                'public/lib/angular-notify/dist/angular-notify.css',
                'public/blue-moonV1.0.3/fonts/font-awesome.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
                'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                // 'public/blue-moonV1.0.3/js/bootstrap.min.js',
                'public/lib/ng-grid/ng-grid-2.0.11.debug.js',
                'public/lib/angular-notify/dist/angular-notify.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};