'use strict';

angular.module('core').service('Sizer', ['$window',
    function($window) {
        var window = angular.element($window);

        this.updateElementSizeToStrech = function(element, heightToRemove){
            element.css('height', (window.height() - heightToRemove) + 'px');
        };

        this.getWindowElement = function() {
            return window;
        };
    }
]);