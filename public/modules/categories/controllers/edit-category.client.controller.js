'use strict';

angular.module('categories').controller('EditCategoryController', ['$scope', '$modalInstance', 'category', 'Alerts',
	function($scope, $modalInstance, category, Alerts) {
		$scope.category = category;

        $scope.modalTitle = 'Edit Category ' + category.name;

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

        // Update existing Category
        $scope.save = function(category) {
            $scope.isLoading = true;
            category.$update(function() {
                $modalInstance.close();
                Alerts.success('Category updated Successfully');
                $scope.isLoading = false;
            }, function(errorResponse) {
                if(errorResponse.data.message !== undefined){
                    Alerts.error(errorResponse.data.message);
                }
                else{
                    Alerts.error(errorResponse.data);
                }

                $scope.isLoading = false;
            });
        };
	}
]);