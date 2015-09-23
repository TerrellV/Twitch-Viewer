(function() {
  angular.module('myApp')
    .directive('myDir', ['$timeout', '$interval', 'setRandomCover', 'parseDataService', 'setGridSystem', dirSample]);

  // custom directie to keep track of dom elements of individual cards...
  function dirSample($interval, $timeout, setRandomCover, parseDataService, setGridSystem) {
    return {
      templateUrl: 'app/build/partials/cardContent.html',
      scope: {
        channel: '=',
        appear: '=',
        toggle: '=',
        showBack: '='
      },
      link: function(scope, element, attributes) {
        // grab all necesssary variables for elemnts in card
        var header = element.find('.header'),
          frontButton = element.find('.subhead-btn'),
          personIcon = frontButton.children(),
          exitButton = element.find('#info-close-btn');

        /*
         * opening and closing more info
         */
         console.log();
         setGridSystem.setMargins(); // may reduce this to not fire 15 times in future.... need access to index of element in the dom
        // animate front button to fill and then fade out
        frontButton.bind("click", () => {
          scope.showBack = true;
          frontButton.addClass("animate-fill");
          personIcon.addClass('animate-hide');
          const id = window.setTimeout(showInfo, 800);

          function showInfo() {
            scope.appear = true;
            scope.$apply();
            const id = window.setTimeout(function() {
              frontButton.removeClass("animate-fill");
              personIcon.removeClass('animate-hide');
            }, 200);
          }
        });
        // animate closing of info pannel
        exitButton.bind('click', () => {
          scope.showBack = false;
          scope.appear = false;
          frontButton.addClass('animate-fill-backwards');
          personIcon.addClass('animate-show');

          const id = window.setTimeout(() => {
            frontButton.removeClass('animate-fill-backwards');
            personIcon.removeClass('animate-show');
          }, 800);

          scope.$apply();
        });

        /*
         * Setting Random CoverPhoto
         */
        if (scope.channel.live === false) {
          const imagePath = setRandomCover.get();
          header.css({
            "background": `linear-gradient(
                        rgba(35, 44, 56, .95),
                        rgba(35, 44, 56, .95)
                        ), url("${imagePath}")`,
            "background-size": "cover"
          });
        } else {
          const previewImg = scope.channel.previewImg;
          const imagePath = setRandomCover.get();
          header.css({
            "background": `linear-gradient(
                      rgba(57, 101, 166, .9),
                      rgba(57, 101, 166, .9)
                    ), url("${previewImg}")`,
            "background-size": "cover"
          });
        }


      }
    }
  }
})();
