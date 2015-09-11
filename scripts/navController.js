(()=>{
    angular.module('myApp')
        .controller('navController',navController);

        function navController($http,$q,menuService) {
            const nav = this;

            nav.setView = menuService.setView;

        }
})()
