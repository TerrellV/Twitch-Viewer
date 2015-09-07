(function(){
    angular.module('myApp')
        .directive('navDir', ['$timeout','$interval',navDir]);

        function navDir() {
            return {
                templateUrl: '/partials/nav.html'
            }
        }

})()
