'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var categories = require('../../app/controllers/categories');

	// Categories Routes
	app.route('/categories')
		.get(users.requiresLogin, users.isAdmin, categories.list)
		.post(users.requiresLogin, users.isAdmin, categories.create);

	app.route('/categories/:categoryId')
		.get(users.requiresLogin, users.isAdmin, categories.read)
		.put(users.requiresLogin, users.isAdmin, categories.update)
		.delete(users.requiresLogin, users.isAdmin, categories.delete);

    app.route('/categories/search/:searchData')
        .get(users.requiresLogin, users.isAdmin, categories.read);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryByID);
    app.param('searchData', categories.search);
};