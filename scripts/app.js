(function() {
    angular.module('myApp', ["ngAnimate"])
        .controller('cardsCtrl', cardsCtrl);

    function cardsCtrl($scope) {

        var vm = this;
        var b = $("#btn");
        var icon = $("#icon");
        vm.animateButton = function startButtonAnimation() {
            animate();
            var id = window.setTimeout(showCardInfo, 800);
        };
        vm.animateButtonBack = function animateBack() {
            b.removeClass("animate-fill");
            b.addClass("animate-fill-backwards");
            icon.removeClass("animate-hide");
            icon.addClass("animate-show");
            vm.showCardInfo = false;
            var id = window.setTimeout(removeClass, 800);
        }
        function animate() {
            b.addClass('animate-fill');
            icon.addClass('animate-hide');
        }
        function removeClass() {
            b.removeClass("animate-fill-backwards");
            icon.removeClass("animate-show");
        }
        function showCardInfo() {
            vm.showCardInfo = true;
            $scope.$apply();
        }
    }
})()
