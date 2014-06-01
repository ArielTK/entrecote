'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('categories').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', {
            categoryId: '@_id',
            searchData: '@_searchData'
		}, {
			update: {
				method: 'PUT'
			},
            search: {
                method: 'GET',
                isArray: true,
                url: 'categories/search/:searchData'
            }
		});
	}
]);