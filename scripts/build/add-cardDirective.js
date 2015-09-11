'use strict';

(function () {
    angular.module('myApp').directive('addCardDir', addCardDir);

    function addCardDir() {
        return {
            templateUrl: '/partials/addCard.html',
            link: function link(scope, element, attr) {
                console.log('connected');
            }
        };
    }
})();
//# sourceMappingURL=add-cardDirective.js.map
