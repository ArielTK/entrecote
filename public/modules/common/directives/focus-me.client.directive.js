'use strict';

angular.module('core').directive('focusMe', ['$timeout',
	function($timeout) {
		return {
			link: function postLink(scope, element, attrs) {

                $timeout(function () {
                    element[0].focus();
                }, 100);
			}
		};
	}
]);