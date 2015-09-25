(function() {
  angular.module('myApp')
    .directive('myDir', ['$timeout', '$interval', 'setRandomCover', 'parseDataService', 'setCardButton', dirSample]);

  // custom directie to keep track of dom elements of individual cards...
  function dirSample($interval, $timeout, setRandomCover, parseDataService, setCardButton) {
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
        var card = element.find('.card'),
          header = element.find('.header'),
          frontButton = element.find('.subhead-btn'),
          personIcon = frontButton.children(),
          exitButton = element.find('#info-close-btn');

          checkHeight();
          // positioning of button
          $(window).resize( checkHeight );

          function checkHeight() {
            // center button dynamically
            // let h = element.height();
            // let hB = frontButton.height();
            // let percent = ( ( (h / 2) / hB) +.5) * 100;
            //
            // frontButton.css({
            //   "-webkit-transform": `translate(200.05%,-${percent}%)`,
            //   "-moz-transform": `translate(200.05%,-${percent}%)`,
            //   "-ms-transform": `translate(200.05%,-${percent}%)`,
            //   "-o-transform": `translate(200.05%,-${percent}%)`,
            //   "transform": `translate(200.05%,-${percent}%)`
            // });

            let h = element.height();
            let hB = frontButton.height();
            let percent = ( ( (h*.15) / hB) +.5) * 100;
            frontButton.css({
              "-webkit-transform": `translate(418%,-${percent}%)`,
              "-moz-transform": `translate(418%,-${percent}%)`,
              "-ms-transform": `translate(418%,-${percent}%)`,
              "-o-transform": `translate(418%,-${percent}%)`,
              "transform": `translate(418%,-${percent}%)`
            });
          }



        /*
         * opening and closing more info
         */

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
