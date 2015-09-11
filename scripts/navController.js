(()=>{
    angular.module('myApp')
        .controller('navController',navController);

        function navController($http,$q,menuService) {
            const nav = this;
            nav.test = 'test';
            nav.setView = menuService.setView;

        }
})()
