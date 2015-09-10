'use strict';

(function () {
    angular.module('myApp').directive('myDir', ['$timeout', '$interval', dirSample]);

    // custom directie to keep track of dom elements of individual cards...
    function dirSample($interval, $timeout) {
        return {
            templateUrl: '/partials/cardContent.html',
            scope: {
                channel: '=',
                appear: '=',
                toggle: '='
            },
            link: function link(scope, element, attributes) {
                // grab all necesssary variables for elemnts in card
                var header = element.find('#head'),
                    infoScreens = element.find('.info-screens'),
                    streamScreen = element.find('.info-stream'),
                    streamContent = element.find('.info-stream'),
                    frontButton = element.find('.subhead-btn'),
                    personIcon = frontButton.children(),
                    exitButton = element.find('#info-close-btn'),
                    nextButton = element.find('.btn-next'),
                    nextButtonIcon = element.find('.next-arrow-container');

                setView(scope.channel);

                function setView(data) {
                    if (data.live === true) {
                        var imgUrl = data.previewImg;
                        var bgString = streamScreen.css({
                            "background": 'linear-gradient(\n                                        to bottom,\n                                        rgba(29, 83, 161, .9),\n                                        rgba(29, 83, 161, .9)\n                                    ),\n                                    url( ' + imgUrl + ' ) center'
                        });
                    } else {}
                }

                /*
                  * opening and closing more info
                */

                // animate front button to fill and then fade out
                frontButton.bind("click", function () {
                    frontButton.addClass("animate-fill");
                    personIcon.addClass('animate-hide');
                    var id = window.setTimeout(showInfo, 800);
                    function showInfo() {
                        scope.appear = true;
                        scope.$apply();
                        var id = window.setTimeout(function () {
                            frontButton.removeClass("animate-fill");
                            personIcon.removeClass('animate-hide');
                        }, 200);
                    }
                });
                // animate closing of info pannel
                exitButton.bind('click', function () {
                    scope.appear = false;
                    frontButton.addClass('animate-fill-backwards');
                    personIcon.addClass('animate-show');

                    var id = window.setTimeout(function () {
                        frontButton.removeClass('animate-fill-backwards');
                        personIcon.removeClass('animate-show');
                    }, 800);

                    scope.$apply();
                });

                /*
                  * sliding between stream/followers slides
                */

                nextButton.bind('click', function () {
                    if (scope.toggle === true) {
                        scope.toggle = false;
                        infoScreens.css('transform', "translateX(-400px)");
                        nextButtonIcon.css("transform", "rotate(-180deg)");
                    } else {
                        scope.toggle = true;
                        infoScreens.css('transform', "translateX(0px)");
                        nextButtonIcon.css("transform", "rotate(0deg)");
                    }

                    scope.$apply();
                });
            }
        };
    }
})();
//# sourceMappingURL=cardDirective.js.map
