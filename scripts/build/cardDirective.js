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
                    frontButton = element.find('.subhead-btn'),
                    personIcon = frontButton.children(),
                    exitButton = element.find('#info-close-btn');

                setView(scope.channel);

                function setView(data) {
                    if (data.live === true) {} else {}
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
            }
        };
    }
})();
//# sourceMappingURL=cardDirective.js.map
