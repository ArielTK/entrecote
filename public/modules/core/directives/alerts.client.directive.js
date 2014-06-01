'use strict';

angular.module('core').directive('alerts', ['$timeout',
	function($timeout) {
		return {
			template: '<alert ng-repeat="alert in alerts" class="alerts-item" type="{{alert.type}}">{{alert.msg}}</alert>',
			restrict: 'E',
            replace: true,
            scope: {
                alerts: '='
            }/*,
			link: function postLink(scope, element, attrs) {
				// Alerts directive logic
				// ...

			}*/
		};
	}
]);


