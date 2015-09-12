'use strict';

(function () {
    angular.module('myApp').controller('navController', navController).controller('addbtnController', addbtnController);

    function navController($http, $q, menuService) {
        var nav = this;
        nav.setView = menuService.setView;
    }
    function addbtnController(popupService) {
        var vm = this;
        vm.showPopup = popupService.showPopup;
    }
})();
//# sourceMappingURL=navController.js.map
