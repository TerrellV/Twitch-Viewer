(function() {
    angular.module('myApp', ["ngAnimate","factories","ngRoute","ngMaterial"]);
})();

(() => {
  angular.module('myApp')
    .controller('popupController', ['$scope', 'popupService', 'getTwitchData', 'parseDataService', '$q', popupController])
    .directive('addcardDir', addcardDir);

  function popupController($scope, popupService, getTwitchData, parseDataService, $q) {
    const vm = this;
    vm.service = popupService;
    vm.showPopup = popupService.showPopup;
    vm.instructionText = "start typing...";

    vm.checkEnter = (event, input) => {
      if (event.charCode === 13) {
        vm.makeRequest(input);
      }
    }

      // passing input value to service to make httpRequest
    vm.makeRequest = stream => {
        if (stream.length > 1) {
          getTwitchData.getStream(stream)
            .then(response => {
              vm.userText = "";
              const res = parseDataService.checkOnline(response);
              // this response needs to be a promise even if...
              // the response is not; i.e if stream is online;
              $q.when(res).then(function(data) {
                if (data.duplicate) {
                  animateErrorResponse(stream, data);
                }
                if (data.valid) {
                  animateSuccessResponse();
                } else {
                  animateErrorResponse(stream, data);
                }
              });
            }, reason => {
              console.log(`${stream} not a valid channel`);
              vm.userText = "";
              animateErrorResponse(stream, reason);
            });
        }
      }
      // animate check icon but allow it to be called multiple times
    function animateSuccessResponse() {
      vm.instructionText = 'Channel Added';
      const check = document.getElementById('poly-check');
      const newCheck = check.cloneNode(true);
      const addIcon = document.getElementById('add-svg-icon');

      addIcon.style.opacity = "0";

      check.classList.add('check-active');
      // 400 ms after animation finishes replace it with the original
      const timeout = window.setTimeout(() => {
        check.parentNode.replaceChild(newCheck, check);
        vm.resultText = "";
        vm.instructionText = "start typing...";
        addIcon.style.opacity = "1";
        $scope.$apply();
      }, 2500);

    }
    // animate x icon but allow it to be called multiple timesx
    function animateErrorResponse(enteredString, reason) {
      if (reason.duplicate) {
        vm.instructionText = `already added.`;
      } else if (!reason.valid) {
        vm.instructionText = `not a channel`;
      }

      // add the class to all of them and set a delay for each...

      const errorIcon = document.getElementById('error-icon');
      const children = errorIcon.children;
      const newGroup = errorIcon.cloneNode(true);
      const addIcon = document.getElementById('add-svg-icon');

      addIcon.style.opacity = "0";

      for (let i = 0; i < children.length; i++) {
        children[i].classList.add('error-active');
      }

      const timeout = window.setTimeout(() => {
        addIcon.style.opacity = "1";
        errorIcon.parentNode.replaceChild(newGroup, errorIcon);
        vm.resultText = "";
        vm.instructionText = "start typing...";
        $scope.$apply();
      }, 2500);

    }
  }

  function addcardDir() {

    return {
      controller: 'popupController',
      controllerAs: "card",
      templateUrl: 'app/build/partials/addCard.html',
      link: (scope, element, attr, ctrl) => {

      }
    }
  }
})();

(function() {

    angular.module('myApp')
        .controller('cardsCtrl', ['$scope','$http','$q','getTwitchData','menuService','setCSS','parseDataService','setCardButton', cardsCtrl]);

    function cardsCtrl($scope, $http, $q, getTwitchData, menuService, setCSS, parseDataService, setCardButton) {

        // seting variable to correct context of this
        const vm = this;
        // array for each card object to be pushed to
        vm.channels = parseDataService.channels;
        // init values

        vm.service = menuService;

        const css = setCSS;
        css.checkPageWidth();
        css.bind();

        // set position of search
        const $p = $('.pageContent');
        const search = $p.find('.search-container');
        const grid = $p.find('.live-card-grid');
        const width = $('.live-card-grid').width();
    }
})();

(function() {
  angular.module('myApp')
    .directive('myDir', ['$timeout', '$interval', 'setRandomCover', 'parseDataService', 'setCardButton','$mdDialog', dirSample]);

  // custom directie to keep track of dom elements of individual cards...
  function dirSample($timeout,$interval,setRandomCover,parseDataService,setCardButton,$mdDialog) {
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
        deleteButton.bind('click', event => {
          let channelArr = (scope.channel.live)? "online": "offline";

          let confirm = $mdDialog.confirm()
            .title('Would you like to delete this channel?')
            .content('If you delete it now but want it back later, just use the add channel button')
            .ariaLabel('Lucky day')
            .targetEvent(event)
            .ok('Yes')
            .cancel('No');
          $mdDialog.show(confirm).then(function() {
            console.log("%cConfirmed Deleting","color:green; font-size:20px;");
            parseDataService.deleteChannel(channelArr,scope.channel);
          }, function() {
            console.log("%cNVM","color:red; font-size:20px;")
          });

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

(()=>{
    angular.module('myApp')
        .controller('navController',navController)
        .controller('addbtnController',['$http','$q','menuService',addbtnController]);

        function navController($http,$q,menuService) {
            const nav = this;
            nav.setView = menuService.setView;
        }
        function addbtnController(popupService){
            const vm = this;
            vm.showPopup = popupService.showPopup;
        }
})();

(function() {
    angular.module('myApp')
      .directive('navDir', ['$timeout', '$interval', 'setCardButton', 'parseDataService', navDir]);

    function navDir($timeout, $interval, setCardButton, parseDataService ) {
      return {
        templateUrl: 'app/build/partials/nav.html',
        controller: 'navController',
        link: function(scope, element, attr) {

          var tabAll = element.find('#tab-all'),
            tabOnline = element.find("#tab-online"),
            tabOffline = element.find("#tab-offline");

          init('all'); //starting tab to show

          function init(str) {
            scope.activeTab = str;
            const loadCh = parseDataService;
          }

          tabAll.bind('click', function() {
            scope.activeTab = 'all';
            scope.$apply();
          });
        tabOnline.bind('click', function() {
          scope.activeTab = 'online';
          scope.$apply();
        });
        tabOffline.bind('click', function() {
          scope.activeTab = 'offline';
          scope.$apply();
        });

      }
    }
  }

})();

(function() {
    angular.module('factories', [])
        .factory('getTwitchData', ['$http', '$q', getTwitchData])
        .factory('setCardButton', setCardButton );

    function getTwitchData($http,$q) {

        var baseUrl = 'https://api/twitch.tv/kraken';
        var defChannels = ['kittyplaysgames','twosync','krzjn', 'kaypealol', 'mrgoldensports','sodapoppin', 'femsteph','riotgames',"LIRIK",'Nick_28T', 'fifaRalle','DBadaev','bibaboy','aimzAtchu','BreaK71',];

        const url = 'https://api.twitch.tv/kraken/streams/';
        const channelUrl = 'https://api.twitch.tv/kraken/channels/';
        const callBack = '?callback=JSON_CALLBACK';

        const obj = {
            async: function() {
                let promises = [];
                const completed = [];
                setPromises();

                // make a request for each channel with a promise
                function setPromises() {
                    defChannels.map(channel => {
                        if (completed.indexOf(channel) === -1) {
                            const promise = $http.jsonp(url+channel+callBack)
                                .then(data => {
                                    return data;
                                });
                            promises.push(promise);
                            completed.push(channel);
                        } else {
                            console.log(`repeat channel found in default list \n--- ${channel} ---`);
                        };
                    })
                };

                return promises;
            },
            getChannel : function(str) { // passing in entire link
                return $http.jsonp(str + callBack)
                    .then( data => {
                        return data;
                    });
            },
            getStream : function( profName ) { // passing in entire link
                return $http.jsonp(url + profName + callBack)
                    .then( data => {
                        return data;
                    });
            }
        };
        return obj;
    }

    function setCardButton() {

      const obj = {
        centerButton: function(){

        }
      }

        return obj;
      }

})();

(()=>{
    angular.module('myApp')
        .service('menuService',menuService)
        .service('popupService',popupService)
        .service('setCSS',setCSS)
        .service('parseDataService',['getTwitchData','$q','setCardButton',parseDataService])
        .service('setRandomCover',setRandomCover);

        function menuService($http,$q) {
            const vm = this;
            vm.online = true;
            vm.offline = true;

            vm.setView = (boolOne,boolTwo) => {
              vm.online = boolOne;
              vm.offline = boolTwo;
            }
        }

        function popupService(){
            // this service is being injected into two instances of the popup controller to communicate via ng show values
            const vm = this;

            vm.showMe = false;

            vm.showPopup = (bool) => {
                vm.showMe = bool;
            }
        }

        function parseDataService(getTwitchData, $q, setCardButton) {
            const vm = this;
            const promises = getTwitchData.async();
        /*
         * Arrays to hows parsed card data used in templates
        */
            vm.channels = {
                online: [],
                offline: []
            }

            vm.deleteChannel = function(ch,obj) {
              const chArr = vm.channels[ch];
              const chIndex = chArr.indexOf(obj);
              chArr.splice(chIndex,1);
            }

        /*
         * Map and request stream and or channel for each
        */
            vm.p = $q.all(promises).then( response => {
              let domSet = new Promise(function(res,rej){
                res( response.map( vm.checkOnline ) );
              }).then(function(){
                setCardButton.centerButton()
              })
            }, reason => {
                console.log( 'default request failed', reason);
            });

            vm.checkOnline = obj => {
                const {data:{message:msg}} = obj;
                // if error
                if (msg) { return { valid:false, msg } }
                // destructure object
                const { data, data: {stream} } = obj;
                // if online
                if (stream) {
                    const { channel } = stream,
                    { display_name:name, game , status } = channel,
                    parsedInfo = vm.setDataOnline(stream);
                     const isDuplicate = checkDuplicates(parsedInfo);
                     if( isDuplicate ) {
                       return { duplicate:true };
                     }

                     vm.channels.online.push(parsedInfo);
                     return { valid:true };
                  }
                else {
                    // if offline
                    const {_links:{channel:url}} = data;
                    return getTwitchData.getChannel(url)
                        .then( data => {
                            // Parese Data for cards
                            const parsedInfo = vm.setDataOffline(data.data);
                            if ( checkDuplicates(parsedInfo) === false ){
                              vm.channels.offline.push(parsedInfo);
                              return { valid:true };
                            } else {
                              return { duplicate:true };
                            }
                        });
                }
            }

            /*
             * Parse Data and Set To Cards Variable
            */
            vm.setDataOffline = data => {
                // channel object later used for ng repeat
                let ci = SetDataBoth(data);
                ci.live = false;
                ci.game = 'Offline';
                ci.frontAction = 'Go to channel';
                return ci;
            }
            vm.setDataOnline = stream => {
                // channel object later used for ng repeat
                const { channel, live, game, viewers, preview:{large} } = stream;

                let ci = SetDataBoth(channel);

                ci.live = true;
                ci.game = concatDscr(game,20);
                ci.viewers = abbreviateNumber(viewers);
                ci.previewImg = setHttpProtocal(large);
                ci.frontAction = 'Watch Now';
                return ci;
            }
            function SetDataBoth(channel){
                // channel object later used for ng repeat
                const { display_name:name, followers, url, status } = channel;
                return {
                    name,
                    followers: abbreviateNumber(followers),
                    url,
                    status: concatDscr(status,20)
                };
            }
            /*
             * Check for Duplicates
            */
            function checkDuplicates( parsedData ) {
                let match = false;
                const {name} = parsedData;
                const {online, offline} = vm.channels;
                const allChannels = online.concat(offline);

                allChannels.map(compare);

                function compare( newChannelObj ) {
                    const {name:existingName} = newChannelObj;
                    if(name.toLowerCase() === existingName.toLowerCase()) {
                        match = true;
                    }
                }

                return match;
            }

            /*
             * further manipulate certain data...
             */
            // abbreviate number
            function abbreviateNumber(value) {
                var newValue = value.toString();

                if (value >= 1000){
                    if ( value < 1000000 ){
                        return `${Math.floor(newValue / 1000)}k`;
                    }
                    else {
                        let n = newValue / 1000000;
                        let s = n.toString();
                        n = `${s.slice(0, s.indexOf('.')+2)}m`;
                        if(n.slice(2,-1) === '0'){
                            return `${n.slice(0,1)}m`;
                        } else return n;
                    }
                }
                return newValue;
            }


          // concat the status
          function concatDscr(str,cutoff) {
              if (str === null) {return ''};
              return (str.length > cutoff )? `${str.slice(0,cutoff)} ...`: str;
          }

        }


        function setCSS() {
          const vm = this;
          const page = $(".pageContent");
          const search = $(".search-container");

          vm.bind = function() {
            $( window ).resize( vm.checkPageWidth );
          }

          vm.checkPageWidth = function() {

            const pWidth = window.innerWidth;
            const pHeight = window.innerHeight;

            if (pWidth > 414) {
              page.css({
                  width:`${pWidth - 200}px`
              });
            } else {
              page.css({
                  "width":"100%"
              });
            }
          }
        }
        function setHttpProtocal(str){
          return str.replace(/(https?:){1}/,window.location.protocol);
        }
        function setRandomCover() {
          const vm = this;
          vm.get = () => {
            const options = ["Images/astroSpace.jpg","Images/csGO.jpg", "Images/marioIsland.jpg", "Images/LoL.jpg"];
            const n = Math.floor(Math.random() * options.length);
            return options[n];
          }
        }
})();
