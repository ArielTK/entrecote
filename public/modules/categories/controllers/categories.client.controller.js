'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories', '$modal', 'Alerts',
	function($scope, $stateParams, $location, Authentication, Categories, $modal, Alerts) {
        $scope.authentication = Authentication;

        $scope.gridOptions = {
            data: 'categories',
            columnDefs: [
                { field: 'name', displayName: 'Name' },
                { field: 'created', displayName: 'Created Date', cellFilter: 'date' },
                { field: 'user.displayName', displayName: 'User' },
            ]
        };

        $scope.gridSearchFunc = function(){
            $scope.find();
        };


        $scope.openNewCategoryWindow = function() {


            var createModal = $modal.open({
                templateUrl: 'modules/categories/views/create-category.client.view.html',
                controller: 'CreateCategoryController'
            });

            createModal.result.then(function () {
                $scope.find();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };






		// Remove existing Category
		$scope.remove = function( category ) {
			if ( category ) { category.$remove();

				for (var i in $scope.categories ) {
					if ($scope.categories [i] === category ) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		// Update existing Category
		$scope.update = function() {
			var category = $scope.category ;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Categories
		$scope.find = function() {
            if (typeof $scope.gridSearchData !== 'undefined' && $scope.gridSearchData != '') {
                    $scope.categories = Categories.search({
                    searchData: $scope.gridSearchData
                });
            }
            else {
                $scope.categories = Categories.query();
            }

		};

		// Find existing Category
		$scope.findOne = function() {
			$scope.category = Categories.get({
				categoryId: $stateParams.categoryId
			});
		};
	}
]);