(function(){
    angular.module('myApp')
        .directive('myDir', ['$timeout','$interval',dirSample]);

    // custom directie to keep track of dom elements of individual cards...
    function dirSample($interval,$timeout) {
        return {
            templateUrl: '/partials/cardContent.html',
            scope: {
                channel: '=',
                appear: '=',
                toggle: '='
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
                    if (scope.toggle === true ){
                        scope.toggle = false;
                        infoScreens.css('transform',"translateX(-400px)");
                        nextButtonIcon.css("transform","rotate(-180deg)");
                    } else {
                        scope.toggle = true;
                        infoScreens.css('transform',"translateX(0px)");
                        nextButtonIcon.css("transform","rotate(0deg)");
                    }


                    scope.$apply();
                });

                // sliding back to stream screen
                clone.bind('click', function() {
                    var cloneIcon = clone.find('.next-arrow-container');
                    infoScreens.css('transform',"translateX(0px)");
                    cloneIcon.addClass('animate-rotateBack');
                    clone.addClass('animate-returnToBox');
                    scope.$apply();
                })

                function reset(){
                    var cloneIcon = clone.find('.next-arrow-container');

                    // remove cloned animate class
                    removeAnimations( clone );
                    removeAnimations( cloneIcon );
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
