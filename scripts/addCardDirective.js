(() => {
    angular.module('myApp')
        .directive('addcardDir', addcardDir );

        function addcardDir() {
            return {
                templateUrl: 'partials/addCard.html',
                link: (scope, element, attr ) => {
                    console.log('connected');
                }
            }
        }
})()
