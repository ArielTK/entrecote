'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$location',

	function($location) {
        var _this = this;

        _this._data = {
            user: window.user
        };

        _this._data.validateSignin = function () {

            if (!_this._data.user){
                $location.path('');
            }
        };
		return _this._data;
	}
]);