'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var categories = require('../../app/controllers/categories');

	// Categories Routes
	app.route('/categories')
		.get(users.requiresLogin, categories.list)
		.post(users.requiresLogin, categories.create);

	app.route('/categories/:categoryId')
		.get(users.requiresLogin, categories.read)
		.put(users.requiresLogin, categories.hasAuthorization, categories.update)
		.delete(users.requiresLogin, categories.hasAuthorization, categories.delete);

    app.route('/categories/search/:searchData')
        .get(users.requiresLogin, categories.read);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
    app.param('searchData', categories.search);
};