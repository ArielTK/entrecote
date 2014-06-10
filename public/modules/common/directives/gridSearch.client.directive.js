'use strict';

angular.module('core').directive('gridSearch', function(){
    return {
        template: '<form style="display:inline;"  ng-submit="gridSearchFunc()"><input type="search" placeholder="Search" class="input-search hidden-xs hidden-sm fa fa-search" focus-me ng-model="gridSearchData"></form>'
    };
});