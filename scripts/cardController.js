(function() {

    angular.module('myApp')
        .controller('cardsCtrl', cardsCtrl);

    function cardsCtrl($scope, $http, $q, getTwitchData, menuService, parseDataService, setCSS) {

        // seting variable to correct context of this
        const vm = this;
        // array for each card object to be pushed to
        vm.channels = parseDataService.channels;
        // init values
        vm.service = menuService;

        const css = setCSS;
        css.setPageWidth();
        css.bind();
    }
})()
