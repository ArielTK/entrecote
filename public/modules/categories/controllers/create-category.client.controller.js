'use strict';

angular.module('categories').controller('CreateCategoryController', ['$scope', '$modalInstance', 'Categories', 'Alerts',
	function($scope, $modalInstance, Categories, Alerts) {

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

        // Create new Category
        $scope.create = function() {
            // Create new Category object
            var category = new Categories ({
                name: this.name
            });



            // Redirect after save
            category.$save(function(response) {
                $modalInstance.close(response);
                Alerts.notify('Save successfully');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            this.name = '';
        };
	}
]);