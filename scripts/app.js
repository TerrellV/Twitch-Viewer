(function() {
    angular.module('myApp', ["ngAnimate"])
        .controller('cardsCtrl', cardsCtrl)
        .directive('myDir', ['$timeout',dirSample]);

    function cardsCtrl($scope) {

        var vm = this;
        vm.channels = [
            {"name": "AppRobotPerson"},
            {"name": "ChinaDino"},
            {"name": "Degroso"},
            {"name": "Bollina"},
            {"name": "Targareous"},
            {"name": "Randopa"}
        ];

        vm.animateButton = function(index) {
            // console.log(vm.channels[index].name);
            animate();
            var id = window.setTimeout(vm.showCardInfo, 800);
        };
        vm.animateButtonBack = function() {
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
    }

    // custom directive to keep track of dom elements of individual cards...
        function dirSample($timeout) {
            return {
                templateUrl: '/partials/cardContent.html',
                scope: {
                    channel: '=',
                    appear: '='
                },
                link: function(scope, element, attributes){
                    var streamContent = element.find('#info-stream'),
                        frontButton = element.find('#btn'),
                        personIcon = frontButton.children(),
                        exitButton = element.find('#info-close-btn');
                    // animate front button to fill and then fade out
                    frontButton.bind("click", function(){
                        $(this).addClass("animate-fill");
                        personIcon.fadeOut(800);
                        $timeout(showInfo,800);
                        function showInfo(){
                            console.log('viola');
                            console.log( scope.appear = true);
                            frontButton.fadeOut(200);
                        }
                    });
                }
            }
        }

})()
