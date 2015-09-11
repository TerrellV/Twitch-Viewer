'use strict';

(function () {
    angular.module('myApp').controller('navController', navController);

    function navController($http, $q, menuService) {
        var nav = this;
        nav.test = 'test';
        nav.setView = menuService.setView;
    }
})();
//# sourceMappingURL=navController.js.map
