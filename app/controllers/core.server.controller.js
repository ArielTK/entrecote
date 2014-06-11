'use strict';

var users = require('../../app/controllers/users');

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    users.createAdminUser();
	res.render('index', {
		user: req.user || null
	});
};