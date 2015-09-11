'use strict';

(function () {
    angular.module('myApp').directive('addcardDir', addcardDir);

    function addcardDir() {
        return {
            templateUrl: 'partials/addCard.html',
            link: function link(scope, element, attr) {
                console.log('connected');
            }
        };
    }
})();
//# sourceMappingURL=addCardDirective.js.map
