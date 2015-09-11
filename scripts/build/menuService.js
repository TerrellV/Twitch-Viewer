'use strict';

(function () {
    angular.module('myApp').service('menuService', menuService);

    function menuService($http, $q) {

        var menu = this;

        menu.online = true;
        menu.offline = true;

        menu.setView = function (boolOne, boolTwo) {
            menu.online = boolOne;
            menu.offline = boolTwo;
            console.log(menu.online, menu.offline);
        };
    }
})();
//# sourceMappingURL=menuService.js.map
