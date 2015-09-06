(function() {
    angular.module('myApp', ["ngAnimate"])
        .controller('cardsCtrl', cardsCtrl)
        .directive('myDir', ['$timeout','$interval',dirSample]);

    function cardsCtrl($scope) {

        var vm = this;
        vm.channels = [
            {"name": "ChinaDino"},
            {"name": "Bollina"},
            {"name": "Targareous"},
        ];
    }
    // custom directie to keep track of dom elements of individual cards...
        function dirSample($interval,$timeout) {
            return {
                templateUrl: '/partials/cardContent.html',
                scope: {
                    channel: '=',
                    appear: '='
                },
                link: function(scope, element, attributes){
                    // grab all necesssary variables for elemnts in card
                    var infoScreens = element.find('.info-screens'),
                        streamContent = element.find('.info-stream'),
                        frontButton = element.find('#btn'),
                        personIcon = frontButton.children(),
                        exitButton = element.find('#info-close-btn'),
                        nextButton = element.find('.btn-next'),
                        nextButtonIcon = element.find('.next-arrow-container'),
                        smallBox = element.find('#little-box');

                /*
                  * opening and closing more info slides
                */

                    // animate front button to fill and then fade out
                    frontButton.bind("click", function(){
                        frontButton.addClass("animate-fill");
                        personIcon.addClass('animate-hide');

                        $timeout(showInfo,801);
                        function showInfo(){
                            scope.appear = true;
                            $timeout(function () {
                                frontButton.removeClass("animate-fill");
                                personIcon.removeClass('animate-hide');
                            }, 200);
                        }
                    });
                    // animate closing of info pannel
                    exitButton.bind('click', function(){
                        scope.appear = false;
                        scope.showFollowers = false;
                        frontButton.addClass('animate-fill-backwards');
                        personIcon.addClass('animate-show');

                        $timeout(function () {
                            frontButton.removeClass('animate-fill-backwards');
                            personIcon.removeClass('animate-show');
                        }, 800);

                        scope.$apply();
                    });

                    /*
                      * sliding between stream/followers slides
                    */
                    nextButton.bind('click', function(){
                        nextButtonIcon.addClass('animate-rotate');
                        var delay = window.setTimeout(function(){
                            infoScreens.addClass('animate-slide');
                            nextButton.addClass('animate-slide-button');
                            scope.showFollowers = true;
                            // start the checker that runs to check position
                            checkPosition();
                        },400);
                        scope.$apply();
                    });

                    function checkPosition(){
                        var promise = window.setInterval(function(){
                            if ( nextButton.position().left < 0 ) {
                                console.log('crossed line');
                                window.clearInterval(promise);
                                var clone = nextButton.clone().css({
                                    "height":"50px",
                                    "width":"50px",
                                    "left":"0px",
                                    "bottom":"0px",
                                });
                                clone.removeClass('animate-slide-button');
                                var cloneIcon = clone.find('.next-arrow-container');
                                cloneIcon.removeClass('animate-rotate');
                                clone.appendTo(smallBox);
                                clone.addClass('animate-return');
                            } else {
                                console.log('checking');
                            }
                        },10);
                    }


                }
            }
        }

})()
