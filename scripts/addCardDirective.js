(() => {
    angular.module('myApp')
        .directive('addcardDir', addcardDir );

        function addcardDir() {
            return {
                require: '^cardsCtrl',
                templateUrl: 'partials/addCard.html',
                link: (scope, element, attr, cardsCtrl ) => {
                }
            }
        }
})()
