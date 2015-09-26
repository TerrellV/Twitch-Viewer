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
          backButton = element.find('#arrow-back-icon'),
          deleteButton = element.find('#delete-icon');

          // position front button on load
          checkHeight();
          // positioning of button on resize event
          $(window).resize( checkHeight );

        /*
         * opening and closing more info
         */

        // animate front button to fill and then fade out
        frontButton.bind("click", () => {

          const [h,hB,xStrt,yStrt,xCent,yCent] = getCurrVals();
          scope.showBack = true;

          if (checkDesktop()) {
            moveButton(xCent,yCent); // move the button to center
            window.setTimeout(scaleButton.bind(null,xCent,yCent,10,0),500);
            const id = window.setTimeout(showInfo,1000); // show card info element
          } else {
            showInfo();
          }

        });

        // exit button animation
        backButton.bind('click', () => {

          const [h,hB,xStrt,yStrt,xCent,yCent] = getCurrVals();

          scope.showBack = false;
          scope.appear = false;

          if ( checkDesktop() ) {
            scaleButton(xCent,yCent,1,1);
            window.setTimeout(moveButton.bind(null,xStrt,yStrt),500);
          }

          scope.$apply();
        });

        // delete button
        deleteButton.bind('click', () => {
          let channelArr = (scope.channel.live)? "online": "offline";
          parseDataService.deleteChannel(channelArr,scope.channel)
          scope.$apply();
        });


        function checkDesktop() {
          return ( $(window).innerWidth() >= 1200)? true: false;
        }


        /*
         * on resize set the position of front button
         */
        function checkHeight() {
          const [h,hB,xStrt,yStrt,xCent,yCent] = getCurrVals();
          frontButton.css({
            "-webkit-transform": `translate(418%,-${yStrt}%)`,
            "-moz-transform": `translate(418%,-${yStrt}%)`,
            "-ms-transform": `translate(418%,-${yStrt}%)`,
            "-o-transform": `translate(418%,-${yStrt}%)`,
            "transform": `translate(418%,-${yStrt}%)`
          });
        }

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
            "-webkit-transition": "all 500ms ease-in-out",
            "-moz-transition": "all 500ms ease-in-out",
            "-ms-transition": "all 500ms ease-in-out",
            "-o-transition": "all 500ms ease-in-out",
            "transition": "all 500ms ease-in-out",
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
                      rgba(69, 56, 174, .9),
                      rgba(69, 56, 174, .9)
                    ), url("${previewImg}")`,
            "background-size": "cover"
          });
        }


      }
    }
  }
})();
