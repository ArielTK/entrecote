'use strict';

angular.module('core').directive('loading', ['$compile',
	function($compile) {

		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
                var updateElement = function(newValue, oldValue) {
                    if (newValue != oldValue) {

                        if (newValue == true) {
                            element.addClass('loading-mask');
                            element.prop('disabled', true);
                            $compile(element)(scope);
                        }
                        else {
                            element.removeClass('loading-mask');
                            element.prop('disabled', false);
                            $compile(element)(scope);
                        }
                    }
                };

                updateElement(scope.loading, null);
                scope.$watch('loading', updateElement);
            },
            scope: {
                loading: "="
            }
		};
	}
]);