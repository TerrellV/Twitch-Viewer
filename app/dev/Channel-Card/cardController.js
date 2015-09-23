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

        const css = setCSS;
        css.checkPageWidth();
        css.bind();

        // set position of search
        const $p = $('.pageContent');
        const search = $p.find('.search-container');
        const grid = $p.find('.live-card-grid');
        const width = $('.live-card-grid').width();
        // search.css({
        //   "width": `90%`
        // });


    }
})();
