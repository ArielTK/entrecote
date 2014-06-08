'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories', '$modal', 'Alerts',
	function($scope, $stateParams, $location, Authentication, Categories, $modal, Alerts) {
        $scope.authentication = Authentication;

        $scope.authentication.validateSignin();

        $scope.selectedCategory = [];

        $scope.gridOptions = {
            data: 'categories',
            multiSelect: false,
            showFooter: true,
            selectedItems: $scope.selectedCategory,
            columnDefs: [
                { field: 'name', displayName: 'Name' },
                { field: 'description', displayName: 'Description' },
                { field: 'created', displayName: 'Created Date', cellFilter: 'date' },
                { field: 'user.displayName', displayName: 'User' },
            ]
        };

        $scope.gridSearchFunc = function(){
            $scope.find();
        };

        $scope.openNewCategoryWindow = function() {
            var createModal = $modal.open({
                templateUrl: 'modules/categories/views/category.client.view.html',
                controller: 'CreateCategoryController'
            });

            createModal.result.then(function () {
                $scope.find();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.openEditCategoryWindow = function(category) {
            if ($scope.selectedCategory.length > 0) {
                var createModal = $modal.open({
                    templateUrl: 'modules/categories/views/category.client.view.html',
                    controller: 'EditCategoryController',
                    resolve: {
                        category: function () {
                            return category;
                        }
                    }
                });

                createModal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
            else{
                Alerts.error('Please select Category to update');
            }
        };




		// Remove existing Category
		$scope.remove = function( category ) {
			if ( category ) {

                var message = 'Are you sure you want to delete category: ' + category.name;
                Alerts.confirm(message, function (e) {
                    if (e) {
                        category.$remove();
                        $scope.find();
                        Alerts.success('Category deleted successfully');
                    }
                });
			}
            else {
                Alerts.error('Please select Category to delete');
			}
		};

		// Find a list of Categories
		$scope.find = function() {
            if (typeof $scope.gridSearchData !== 'undefined' && $scope.gridSearchData !== '') {

                $scope.categories = Categories.search({
                    searchData: $scope.gridSearchData
                });
                // $scope.selectedCategory = [];
            }
            else {
                $scope.categories = Categories.query();
                // $scope.selectedCategory = [];
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