'use strict';

angular.module('categories').controller('CreateCategoryController', ['$scope', '$modalInstance', 'Categories', 'Alerts',
	function($scope, $modalInstance, Categories, Alerts) {

        $scope.modalTitle = 'Create New Category';
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

        // Create new Category
        $scope.save = function(categoryParam) {

            $scope.isLoading = true;
            // Create new Category object
            var category = new Categories ({
                name: categoryParam.name,
                description: categoryParam.description
            });

            // Redirect after save
            category.$save(function(response) {
                $modalInstance.close(response);
                Alerts.success('Category Added Successfully');
                $scope.isLoading = false;
            }, function(errorResponse) {
                Alerts.error(errorResponse.data.message);
                $scope.isLoading = false;
            });


        };

	}
]);