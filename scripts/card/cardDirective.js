(function(){
    angular.module('myApp')
        .directive('myDir', ['$timeout','$interval',dirSample]);

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
                    smallBox = element.find('#little-box'),
                    clone = nextButton.clone().addClass('inBox').appendTo(smallBox);


            /*
              * opening and closing more info slides
            */

                // animate front button to fill and then fade out
                frontButton.bind("click", function(){
                    frontButton.addClass("animate-fill");
                    personIcon.addClass('animate-hide');

                    var id = window.setTimeout(showInfo,800);
                    function showInfo(){
                        scope.appear = true;
                        scope.$apply();
                        var id = window.setTimeout(function () {
                            frontButton.removeClass("animate-fill");
                            personIcon.removeClass('animate-hide');
                        }, 200);
                    }
                });
                // animate closing of info pannel
                exitButton.bind('click', function(){
                    scope.appear = false;
                    frontButton.addClass('animate-fill-backwards');
                    personIcon.addClass('animate-show');
                    // call function that removes all classes / resets
                    reset();

                    var id = window.setTimeout(function () {
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

                            clone.removeClass('animate-slide-button');
                            var cloneIcon = clone.find('.next-arrow-container');
                            window.clearInterval(promise);
                            cloneIcon.removeClass('animate-rotate');
                            clone.addClass('animate-return');
                        } else {
                            console.log('checking');
                        }
                    },10);
                }

                function reset(){
                    // remove cloned animate class

                    removeAnimations( clone );
                    removeAnimations( infoScreens );
                    removeAnimations( nextButton );
                    removeAnimations( nextButtonIcon );

                    function removeAnimations ( element ) {
                        var reg = /\s+/;
                        var arr = element.attr('class').split(reg);
                        var removeUs = arr.filter(function(a){
                            var removeMe = a.indexOf('animate')>-1? a : '';
                            element.removeClass(removeMe);
                        });

                        // console.log(element.attr('class').split(reg));
                    }
                }
            }
        }
    }
})()
