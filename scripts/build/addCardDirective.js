'use strict';

(function () {
    angular.module('myApp').directive('addcardDir', addcardDir);

    function addcardDir() {
        return {
            require: '^cardsCtrl',
            templateUrl: 'partials/addCard.html',
            link: function link(scope, element, attr, cardsCtrl) {}
        };
    }
})();
//# sourceMappingURL=addCardDirective.js.map
