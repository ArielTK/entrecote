'use strict';

angular.module('core').directive('stretchHeight', function(Sizer){
    return {
        scope: {
            heightToRemove: '=stretchHeight'
        },
        link: function (scope, element, attrs) {
            Sizer.updateElementSizeToStrech(element, scope.heightToRemove);
            Sizer.getWindowElement().on('resize', function(event) {
                Sizer.updateElementSizeToStrech(element, scope.heightToRemove);
            });
        }
    };
});