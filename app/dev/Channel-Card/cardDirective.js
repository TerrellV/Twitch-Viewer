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
          personIcon = frontButton.find('#person-svg-icon'),
          exitButton = element.find('#info-close-btn');

          // init values on load
          checkHeight();
          // positioning of button
          $(window).resize( checkHeight );

          function checkHeight() {

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
          const [h,hB,xStrt,yStrt,xCent,yCent] = getCurrVals();

          moveButton(xCent,yCent); // move the button to center
          window.setTimeout(scaleButton.bind(null,xCent,yCent,10,0),500);
          const id = window.setTimeout(showInfo, 800); // show card info element
        });

        // exit button animation
        exitButton.bind('click', () => {
          const [h,hB,xStrt,yStrt,xCent,yCent] = getCurrVals();

          scope.showBack = false;
          scope.appear = false;

          scaleButton(xCent,yCent,1,1);
          window.setTimeout(moveButton.bind(null,xStrt,yStrt),500);
          scope.$apply();
        });


        /*
         * Get css values for positioning
         */
        function getCurrVals() {
          let h = element.height();
          let hB = frontButton.height();
          const xStrt = 418;
          let yStrt = ( ( (h*.15) / hB) +.5) * 100;
          const xCent = 227.832;
          let yCent = ( ( (h / 2) / hB) +.5) * 100;
          return [h,hB,xStrt,yStrt,xCent,yCent];
        }

        /*
         * Move Button Function
         */
        function moveButton(xPerc,yPerc) {
          frontButton.css({
            "-webkit-transition": "all 500ms ease-in-out",
            "-moz-transition": "all 500ms ease-in-out",
            "-ms-transition": "all 500ms ease-in-out",
            "-o-transition": "all 500ms ease-in-out",
            "transition": "all 500ms ease-in-out",
            "-webkit-transform": `translate(${xPerc}%,-${yPerc}%) `,
            "-moz-transform": `translate(${xPerc}%,-${yPerc}%) `,
            "-ms-transform": `translate(${xPerc}%,-${yPerc}%) `,
            "-o-transform": `translate(${xPerc}%,-${yPerc}%) `,
            "transform": `translate(${xPerc}%,-${yPerc}%) `
          });
        }

        /*
         * Scale Button Function
         */
        function scaleButton(xPerc,yPerc,scl,opc) {
          personIcon.css({
            "opacity":`${opc}`
          });
          frontButton.css({
            "-webkit-transition": "all 300ms ease-in-out",
            "-moz-transition": "all 300ms ease-in-out",
            "-ms-transition": "all 300ms ease-in-out",
            "-o-transition": "all 300ms ease-in-out",
            "transition": "all 300ms ease-in-out",
            "-webkit-transform":`translate(${xPerc}%,-${yPerc}%) scale(${scl})`,
            "-moz-transform":`translate(${xPerc}%,-${yPerc}%) scale(${scl})`,
            "-ms-transform":`translate(${xPerc}%,-${yPerc}%) scale(${scl})`,
            "-o-transform":`translate(${xPerc}%,-${yPerc}%) scale(${scl})`,
            "transform":`translate(${xPerc}%,-${yPerc}%) scale(${scl})`
          })
        }

        /*
         * Show Info element
         */
         function showInfo() {
           scope.appear = true;
           scope.$apply();
         }

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
