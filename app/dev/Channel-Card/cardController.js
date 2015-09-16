(function() {

    angular.module('myApp')
        .controller('cardsCtrl', ['$scope','$http','$q','getTwitchData','menuService','setCSS','parseDataService', cardsCtrl]);

    function cardsCtrl($scope, $http, $q, getTwitchData, menuService, setCSS, parseDataService) {

        // seting variable to correct context of this
        const vm = this;
        // array for each card object to be pushed to
        vm.channels = parseDataService.channels;
        // init values
        vm.service = menuService;
        // working working working... testing watch and grunt on save
        const css = setCSS;
        console.log(css);
        css.setPageWidth();
        css.bind();
    }
})();
