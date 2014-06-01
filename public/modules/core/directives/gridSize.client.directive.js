'use strict';

angular.module('core').directive('gridSize', function(Sizer){
    return {
        link: function (scope, element, attrs) {
            // alert(Sizer.getSize());
            Sizer.updateElementSizeToStrech(element);
            Sizer.getWindowElement().on('resize', function(event) {
                Sizer.updateElementSizeToStrech(element);
            });
        }
    };
});