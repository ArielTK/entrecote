'use strict';

angular.module('common').directive('tableList', [
	function() {
		return {
			templateUrl: 'modules/common/templates/table-list.client.template.html',
			restrict: 'A',
            // replace: true,
            scope: {
                options: '=',
                data: '='
            },
			link: function postLink(scope, element, attrs) {
				// alert(scope.data);
                // scope.watch()
                /*scope.$watchCollection("data", function (newValue, oldValue){
                    alert('data is ' + newValue);
                });*/

			}
		};
	}
]);