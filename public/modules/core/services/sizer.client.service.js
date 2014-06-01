'use strict';

angular.module('core').service('Sizer', ['$window',
    function($window) {
        var window = angular.element($window);

        this.updateElementSizeToStrech = function(element){
            element.css('height', (window.height() - 250) + 'px');
        };

        this.getWindowElement = function() {
            return window;
        };
    }
]);