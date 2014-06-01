'use strict';

angular.module('core').directive('gridSearch', function(){
    return {
        template: '<form ng-submit="gridSearchFunc()"><input type="text" focus-me ng-model="gridSearchData"><button type="submit" class="btn btn-primary btn-sm">Search</button></form>'
    };
});