"use strict";
/*
* Css column fallback
* Requires multicolumn.js
* @usage <ul class="multi-column-polyfill"></ul>
* or <ul multi-column-polyfill="" data-column-refresh="myvar"></ul>
*/
app.directive('multiColumnPolyfill', [ function () {
    return {
        restrict: 'AC',
        link: function (scope, element, attrs) {
            if (!Modernizr.csscolumns) {
                var update = function () {
                    element.multicolumn();
                }
                update();
                scope.$watch(attrs.columnRefresh, function (val) {
                    update();
                });
            }
        }
    };
}]);