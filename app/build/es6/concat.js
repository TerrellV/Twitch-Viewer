"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

(function () {
  angular.module('myApp', ["ngAnimate", "factories", "ngRoute"]);
})();

(function () {
  angular.module('myApp').controller('popupController', ['$scope', 'popupService', 'getTwitchData', 'parseDataService', '$q', popupController]).directive('addcardDir', addcardDir);

  function popupController($scope, popupService, getTwitchData, parseDataService, $q) {
    var vm = this;
    vm.service = popupService;
    vm.showPopup = popupService.showPopup;
    vm.instructionText = "start typing...";

    vm.checkEnter = function (event, input) {
      if (event.charCode === 13) {
        vm.makeRequest(input);
      }
    };

    // passing input value to service to make httpRequest
    vm.makeRequest = function (stream) {
      if (stream.length > 1) {
        getTwitchData.getStream(stream).then(function (response) {
          vm.userText = "";
          var res = parseDataService.checkOnline(response);
          // this response needs to be a promise even if...
          // the response is not; i.e if stream is online;
          $q.when(res).then(function (data) {
            if (data.duplicate) {
              animateErrorResponse(stream, data);
            }
            if (data.valid) {
              animateSuccessResponse();
            } else {
              animateErrorResponse(stream, data);
            }
          });
        }, function (reason) {
          console.log(stream + " not a valid channel");
          vm.userText = "";
          animateErrorResponse(stream, reason);
        });
      }
    };
    // animate check icon but allow it to be called multiple times
    function animateSuccessResponse() {
      vm.instructionText = 'Channel Added';
      var check = document.getElementById('poly-check');
      var newCheck = check.cloneNode(true);
      var addIcon = document.getElementById('add-svg-icon');

      addIcon.style.opacity = "0";

      check.classList.add('check-active');
      // 400 ms after animation finishes replace it with the original
      var timeout = window.setTimeout(function () {
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
        vm.instructionText = "already added.";
      } else if (!reason.valid) {
        vm.instructionText = "not a channel";
      }

      // add the class to all of them and set a delay for each...

      var errorIcon = document.getElementById('error-icon');
      var children = errorIcon.children;
      var newGroup = errorIcon.cloneNode(true);
      var addIcon = document.getElementById('add-svg-icon');

      addIcon.style.opacity = "0";

      for (var i = 0; i < children.length; i++) {
        children[i].classList.add('error-active');
      }

      var timeout = window.setTimeout(function () {
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
      link: function link(scope, element, attr, ctrl) {}
    };
  }
})();

(function () {

  angular.module('myApp').controller('cardsCtrl', ['$scope', '$http', '$q', 'getTwitchData', 'menuService', 'setCSS', 'parseDataService', 'setCardButton', cardsCtrl]);

  function cardsCtrl($scope, $http, $q, getTwitchData, menuService, setCSS, parseDataService, setCardButton) {

    // seting variable to correct context of this
    var vm = this;
    // array for each card object to be pushed to
    vm.channels = parseDataService.channels;
    // init values

    vm.service = menuService;

    var css = setCSS;
    css.checkPageWidth();
    css.bind();

    // set position of search
    var $p = $('.pageContent');
    var search = $p.find('.search-container');
    var grid = $p.find('.live-card-grid');
    var width = $('.live-card-grid').width();
  }
})();

(function () {
  angular.module('myApp').directive('myDir', ['$timeout', '$interval', 'setRandomCover', 'parseDataService', 'setCardButton', dirSample]);

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
      link: function link(scope, element, attributes) {
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
        $(window).resize(checkHeight);

        /*
         * opening and closing more info
         */

        // animate front button to fill and then fade out
        frontButton.bind("click", function () {
          var _getCurrVals = getCurrVals();

          var _getCurrVals2 = _slicedToArray(_getCurrVals, 6);

          var h = _getCurrVals2[0];
          var hB = _getCurrVals2[1];
          var xStrt = _getCurrVals2[2];
          var yStrt = _getCurrVals2[3];
          var xCent = _getCurrVals2[4];
          var yCent = _getCurrVals2[5];

          scope.showBack = true;
          moveButton(xCent, yCent); // move the button to center
          window.setTimeout(scaleButton.bind(null, xCent, yCent, 10, 0), 500);
          var id = window.setTimeout(showInfo, 1000); // show card info element
        });

        // exit button animation
        backButton.bind('click', function () {
          var _getCurrVals3 = getCurrVals();

          var _getCurrVals32 = _slicedToArray(_getCurrVals3, 6);

          var h = _getCurrVals32[0];
          var hB = _getCurrVals32[1];
          var xStrt = _getCurrVals32[2];
          var yStrt = _getCurrVals32[3];
          var xCent = _getCurrVals32[4];
          var yCent = _getCurrVals32[5];

          scope.showBack = false;
          scope.appear = false;

          scaleButton(xCent, yCent, 1, 1);
          window.setTimeout(moveButton.bind(null, xStrt, yStrt), 500);
          scope.$apply();
        });

        // delete button
        deleteButton.bind('click', function () {
          var channelArr = scope.channel.live ? "online" : "offline";
          parseDataService.deleteChannel(channelArr, scope.channel);
          scope.$apply();
        });

        /*
         * on resize set the position of front button
         */
        function checkHeight() {
          var _getCurrVals4 = getCurrVals();

          var _getCurrVals42 = _slicedToArray(_getCurrVals4, 6);

          var h = _getCurrVals42[0];
          var hB = _getCurrVals42[1];
          var xStrt = _getCurrVals42[2];
          var yStrt = _getCurrVals42[3];
          var xCent = _getCurrVals42[4];
          var yCent = _getCurrVals42[5];

          frontButton.css({
            "-webkit-transform": "translate(418%,-" + yStrt + "%)",
            "-moz-transform": "translate(418%,-" + yStrt + "%)",
            "-ms-transform": "translate(418%,-" + yStrt + "%)",
            "-o-transform": "translate(418%,-" + yStrt + "%)",
            "transform": "translate(418%,-" + yStrt + "%)"
          });
        }

        /*
         * Get css values for positioning
         */
        function getCurrVals() {
          var h = element.height();
          var hB = frontButton.height();
          var xStrt = 418;
          var yStrt = (h * .15 / hB + .5) * 100;
          var xCent = 227.832;
          var yCent = (h / 2 / hB + .5) * 100;
          return [h, hB, xStrt, yStrt, xCent, yCent];
        }

        /*
         * Move Button Function
         */
        function moveButton(xPerc, yPerc) {
          frontButton.css({
            "-webkit-transition": "all 500ms ease-in-out",
            "-moz-transition": "all 500ms ease-in-out",
            "-ms-transition": "all 500ms ease-in-out",
            "-o-transition": "all 500ms ease-in-out",
            "transition": "all 500ms ease-in-out",
            "-webkit-transform": "translate(" + xPerc + "%,-" + yPerc + "%) ",
            "-moz-transform": "translate(" + xPerc + "%,-" + yPerc + "%) ",
            "-ms-transform": "translate(" + xPerc + "%,-" + yPerc + "%) ",
            "-o-transform": "translate(" + xPerc + "%,-" + yPerc + "%) ",
            "transform": "translate(" + xPerc + "%,-" + yPerc + "%) "
          });
        }

        /*
         * Scale Button Function
         */
        function scaleButton(xPerc, yPerc, scl, opc) {
          personIcon.css({
            "opacity": "" + opc
          });
          frontButton.css({
            "-webkit-transition": "all 500ms ease-in-out",
            "-moz-transition": "all 500ms ease-in-out",
            "-ms-transition": "all 500ms ease-in-out",
            "-o-transition": "all 500ms ease-in-out",
            "transition": "all 500ms ease-in-out",
            "-webkit-transform": "translate(" + xPerc + "%,-" + yPerc + "%) scale(" + scl + ")",
            "-moz-transform": "translate(" + xPerc + "%,-" + yPerc + "%) scale(" + scl + ")",
            "-ms-transform": "translate(" + xPerc + "%,-" + yPerc + "%) scale(" + scl + ")",
            "-o-transform": "translate(" + xPerc + "%,-" + yPerc + "%) scale(" + scl + ")",
            "transform": "translate(" + xPerc + "%,-" + yPerc + "%) scale(" + scl + ")"
          });
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
          var imagePath = setRandomCover.get();
          header.css({
            "background": "linear-gradient(\n                        rgba(35, 44, 56, .95),\n                        rgba(35, 44, 56, .95)\n                        ), url(\"" + imagePath + "\")",
            "background-size": "cover"
          });
        } else {
          var previewImg = scope.channel.previewImg;
          var imagePath = setRandomCover.get();
          header.css({
            "background": "linear-gradient(\n                      rgba(69, 56, 174, .9), \n                      rgba(69, 56, 174, .9)\n                    ), url(\"" + previewImg + "\")",
            "background-size": "cover"
          });
        }
      }
    };
  }
})();

(function () {
  angular.module('myApp').controller('navController', navController).controller('addbtnController', ['$http', '$q', 'menuService', addbtnController]);

  function navController($http, $q, menuService) {
    var nav = this;
    nav.setView = menuService.setView;
  }
  function addbtnController(popupService) {
    var vm = this;
    vm.showPopup = popupService.showPopup;
  }
})();

(function () {
  angular.module('myApp').directive('navDir', ['$timeout', '$interval', 'setCardButton', 'parseDataService', navDir]);

  function navDir($timeout, $interval, setCardButton, parseDataService) {
    return {
      templateUrl: 'app/build/partials/nav.html',
      controller: 'navController',
      link: function link(scope, element, attr) {

        var tabAll = element.find('#tab-all'),
            tabOnline = element.find("#tab-online"),
            tabOffline = element.find("#tab-offline");

        init('all'); //starting tab to show

        function init(str) {
          scope.activeTab = str;
          var loadCh = parseDataService;
        }

        tabAll.bind('click', function () {
          scope.activeTab = 'all';
          scope.$apply();
        });
        tabOnline.bind('click', function () {
          scope.activeTab = 'online';
          scope.$apply();
        });
        tabOffline.bind('click', function () {
          scope.activeTab = 'offline';
          scope.$apply();
        });
      }
    };
  }
})();

(function () {
  angular.module('factories', []).factory('getTwitchData', ['$http', '$q', getTwitchData]).factory('setCardButton', setCardButton);

  function getTwitchData($http, $q) {

    var baseUrl = 'https://api/twitch.tv/kraken';
    var defChannels = ['comster404', 'freecodecamp', 'kittyplaysgames', 'twosync', 'krzjn', 'kaypealol', 'mrgoldensports', 'sodapoppin', 'femsteph', 'justin', 'syndicate', 'riotgames', 'captiansparklez', "LIRIK", "phantomL0rd", 'Nick_28T', 'fifaRalle', 'DBadaev', 'bibaboy', 'aimzAtchu', 'BreaK71'];

    var url = 'https://api.twitch.tv/kraken/streams/';
    var channelUrl = 'https://api.twitch.tv/kraken/channels/';
    var callBack = '?callback=JSON_CALLBACK';

    var obj = {
      async: function async() {
        var promises = [];
        var completed = [];
        setPromises();

        // make a request for each channel with a promise
        function setPromises() {
          defChannels.map(function (channel) {
            if (completed.indexOf(channel) === -1) {
              var promise = $http.jsonp(url + channel + callBack).then(function (data) {
                return data;
              });
              promises.push(promise);
              completed.push(channel);
            } else {
              console.log("repeat channel found in default list \n--- " + channel + " ---");
            };
          });
        };

        return promises;
      },
      getChannel: function getChannel(str) {
        // passing in entire link
        return $http.jsonp(str + callBack).then(function (data) {
          return data;
        });
      },
      getStream: function getStream(profName) {
        // passing in entire link
        return $http.jsonp(url + profName + callBack).then(function (data) {
          return data;
        });
      }
    };
    return obj;
  }

  function setCardButton() {

    var obj = {
      centerButton: function centerButton() {}
    };

    return obj;
  }
})();

(function () {
  angular.module('myApp').service('menuService', menuService).service('popupService', popupService).service('setCSS', setCSS).service('parseDataService', ['getTwitchData', '$q', 'setCardButton', parseDataService]).service('setRandomCover', setRandomCover);

  function menuService($http, $q) {
    var vm = this;
    vm.online = true;
    vm.offline = true;

    vm.setView = function (boolOne, boolTwo) {
      vm.online = boolOne;
      vm.offline = boolTwo;
    };
  }

  function popupService() {
    // this service is being injected into two instances of the popup controller to communicate via ng show values
    var vm = this;

    vm.showMe = false;

    vm.showPopup = function (bool) {
      vm.showMe = bool;
    };
  }

  function parseDataService(getTwitchData, $q, setCardButton) {
    var vm = this;
    var promises = getTwitchData.async();
    /*
     * Arrays to hows parsed card data used in templates
    */
    vm.channels = {
      online: [],
      offline: []
    };

    vm.deleteChannel = function (ch, obj) {
      var chArr = vm.channels[ch];
      var chIndex = chArr.indexOf(obj);
      chArr.splice(chIndex, 1);
    };

    /*
     * Map and request stream and or channel for each
    */
    vm.p = $q.all(promises).then(function (response) {
      var domSet = new Promise(function (res, rej) {
        res(response.map(vm.checkOnline));
      }).then(function () {
        setCardButton.centerButton();
      });
    }, function (reason) {
      console.log('default request failed', reason);
    });

    vm.checkOnline = function (obj) {
      var msg = obj.data.message;

      // if error
      if (msg) {
        return { valid: false, msg: msg };
      }
      // destructure object
      var data = obj.data;
      var stream = obj.data.stream;

      // if online
      if (stream) {
        var channel = stream.channel;
        var _name = channel.display_name;
        var game = channel.game;
        var _status = channel.status;
        var parsedInfo = vm.setDataOnline(stream);
        var isDuplicate = checkDuplicates(parsedInfo);
        if (isDuplicate) {
          return { duplicate: true };
        }

        vm.channels.online.push(parsedInfo);
        return { valid: true };
      } else {
        // if offline
        var url = data._links.channel;

        return getTwitchData.getChannel(url).then(function (data) {
          // Parese Data for cards
          var parsedInfo = vm.setDataOffline(data.data);
          if (checkDuplicates(parsedInfo) === false) {
            vm.channels.offline.push(parsedInfo);
            return { valid: true };
          } else {
            return { duplicate: true };
          }
        });
      }
    };

    /*
     * Parse Data and Set To Cards Variable
    */
    vm.setDataOffline = function (data) {
      // channel object later used for ng repeat
      var ci = SetDataBoth(data);
      ci.live = false;
      ci.game = 'Offline';
      ci.frontAction = 'Go to channel';
      return ci;
    };
    vm.setDataOnline = function (stream) {
      // channel object later used for ng repeat
      var channel = stream.channel;
      var live = stream.live;
      var game = stream.game;
      var viewers = stream.viewers;
      var large = stream.preview.large;

      var ci = SetDataBoth(channel);

      ci.live = true;
      ci.game = game;
      ci.viewers = abbreviateNumber(viewers);
      ci.previewImg = large;
      ci.strmDscr = concatDscr(status);
      ci.frontAction = 'Watch Now';
      return ci;
    };
    function SetDataBoth(channel) {
      // channel object later used for ng repeat
      var name = channel.display_name;
      var followers = channel.followers;
      var url = channel.url;
      var status = channel.status;

      return {
        name: name,
        followers: abbreviateNumber(followers),
        url: url,
        status: concatDscr(status)
      };
    }
    /*
     * Check for Duplicates
    */
    function checkDuplicates(parsedData) {
      var match = false;
      var name = parsedData.name;
      var _vm$channels = vm.channels;
      var online = _vm$channels.online;
      var offline = _vm$channels.offline;

      var allChannels = online.concat(offline);

      allChannels.map(compare);

      function compare(newChannelObj) {
        var existingName = newChannelObj.name;

        if (name.toLowerCase() === existingName.toLowerCase()) {
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

      if (value >= 1000) {
        if (value < 1000000) {
          return Math.floor(newValue / 1000) + "k";
        } else {
          var n = newValue / 1000000;
          var s = n.toString();
          n = s.slice(0, s.indexOf('.') + 2) + "m";
          if (n.slice(2, -1) === '0') {
            return n.slice(0, 1) + "m";
          } else return n;
        }
      }
      return newValue;
    }
    // concat the status
    function concatDscr(str) {
      if (str === null) {
        return '';
      }
      return str.slice(0, 30) + " ...";
    }
  }
  function setCSS() {
    var vm = this;
    var page = $(".pageContent");
    var search = $(".search-container");

    vm.bind = function () {
      $(window).resize(vm.checkPageWidth);
    };

    vm.checkPageWidth = function () {

      var pWidth = window.innerWidth;
      var pHeight = window.innerHeight;

      if (pWidth > 414) {
        page.css({
          width: pWidth - 200 + "px"
        });
      } else {
        page.css({
          "width": "100%"
        });
      }
    };
  }

  function setRandomCover() {
    var vm = this;
    vm.get = function () {
      var options = ["Images/astroSpace.jpg", "Images/csGO.jpg", "Images/marioIsland.jpg", "Images/LoL.jpg"];
      var n = Math.floor(Math.random() * options.length);
      return options[n];
    };
  }
})();
//# sourceMappingURL=concat.js.map
