"use strict";

(function () {
    angular.module('myApp', ["ngAnimate", "factories", "ngRoute"]);
})();

(function () {
    angular.module('myApp').controller('popupController', ['$scope', 'popupService', 'getTwitchData', 'parseDataService', '$q', popupController]).directive('addcardDir', addcardDir);

    function popupController($scope, popupService, getTwitchData, parseDataService, $q) {
        var vm = this;
        vm.service = popupService;
        vm.showPopup = popupService.showPopup;

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
                    animateErrorResponse(stream, returnedObj);
                });
            }
        };
        // animate check icon but allow it to be called multiple times
        function animateSuccessResponse() {
            vm.resultText = 'Channel Added';
            var check = document.getElementById('poly-check');
            var newCheck = check.cloneNode(true);

            check.classList.add('check-active');
            // 400 ms after animation finishes replace it with the original
            var timeout = window.setTimeout(function () {
                check.parentNode.replaceChild(newCheck, check);
                vm.resultText = "";
                $scope.$apply();
            }, 1500);
        }
        // animate x icon but allow it to be called multiple timesx
        function animateErrorResponse(enteredString, reason) {
            if (reason.duplicate) {
                vm.resultText = "\"" + enteredString + "\" Already Added.";
            } else if (!reason.valid) {
                vm.resultText = "\"" + enteredString + "\" not valid.";
            }

            var xPaths = document.querySelectorAll('#xOne, #xTwo');
            var group = document.getElementById('x-group');
            var newGroup = group.cloneNode(true);

            var array = [xPaths[0], xPaths[1]];

            // give each path an active class;
            array.map(function (elem) {
                elem.classList.add('x-active');
            });

            var timeout = window.setTimeout(function () {
                group.parentNode.replaceChild(newGroup, group);
                vm.resultText = "";
                $scope.$apply();
            }, 1500);
        }
    }

    function addcardDir() {

        return {
            controller: 'popupController',
            controllerAs: "card",
            templateUrl: 'app/build/script/Add-Card/addCard.html',
            link: function link(scope, element, attr, ctrl) {}
        };
    }
})();

(function () {

    angular.module('myApp').controller('cardsCtrl', ['$scope', '$http', '$q', 'getTwitchData', 'menuService', 'setCSS', 'parseDataService', cardsCtrl]);

    function cardsCtrl($scope, $http, $q, getTwitchData, menuService, setCSS, parseDataService) {

        // seting variable to correct context of this
        var vm = this;
        // array for each card object to be pushed to
        vm.channels = parseDataService.channels;
        // init values
        vm.service = menuService;
        // working working working... testing watch and grunt on save
        var css = setCSS;
        css.checkPageWidth();
        css.bind();
    }
})();

(function () {
    angular.module('myApp').directive('myDir', ['$timeout', '$interval', dirSample]);

    // custom directie to keep track of dom elements of individual cards...
    function dirSample($interval, $timeout) {
        return {
            templateUrl: 'app/build/script/Channel-Card/cardContent.html',
            scope: {
                channel: '=',
                appear: '=',
                toggle: '=',
                showBack: '='
            },
            link: function link(scope, element, attributes) {
                // grab all necesssary variables for elemnts in card
                var header = element.find('#head'),
                    frontButton = element.find('.subhead-btn'),
                    personIcon = frontButton.children(),
                    exitButton = element.find('#info-close-btn');

                /*
                  * opening and closing more info
                */

                // animate front button to fill and then fade out
                frontButton.bind("click", function () {
                    scope.showBack = true;
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
                    scope.showBack = false;
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
    angular.module('myApp').directive('navDir', ['$timeout', '$interval', navDir]);

    function navDir() {
        return {
            templateUrl: 'app/build/script/Navigation/nav.html',
            controller: 'navController',
            link: function link(scope, element, attr) {

                var tabAll = element.find('#tab-all'),
                    tabOnline = element.find("#tab-online"),
                    tabOffline = element.find("#tab-offline");

                init('all'); //starting tab to show

                function init(str) {
                    scope.activeTab = str;
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
    angular.module('factories', []).factory('getTwitchData', ['$http', '$q', getTwitchData]);

    function getTwitchData($http, $q) {

        var baseUrl = 'https://api/twitch.tv/kraken';
        var defChannels = ['comster404', 'freecodecamp', 'kittyplaysgames', 'twosync', 'freecodecamp'];
        var otherChannels = ['krzjn', 'kaypealol', 'mrgoldensports', 'vgbootcamp', 'sodapoppin', 'femsteph', 'streamerhouse', 'joshog', 'pgl'];

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
                    otherChannels.map(function (channel) {
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
})();

(function () {
    angular.module('myApp').service('menuService', menuService).service('popupService', popupService).service('parseDataService', parseDataService).service('setCSS', setCSS);

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

    function parseDataService(getTwitchData, $q) {

        var vm = this;
        var promises = getTwitchData.async();

        /*
         * Arrays to hows parsed card data used in templates
        */
        vm.channels = {
            online: [],
            offline: []
        };

        /*
         * Map and request stream and or channel for each
        */
        var P = $q.all(promises).then(function (response) {
            response.map(vm.checkOnline);
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
                vm.channels.online.push(parsedInfo);
                return { valid: true };
            } else {
                // if offline
                var url = data._links.channel;

                return getTwitchData.getChannel(url).then(function (data) {
                    // Parese Data for cards
                    var parsedInfo = vm.setDataOffline(data.data);
                    if (!checkDuplicates(parsedInfo)) {
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

            // construct object using const variables above
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

            allChannels.map(function compare(newChannelObj) {
                var existingName = newChannelObj.name;

                if (name.toLowerCase() === existingName.toLowerCase()) {
                    match = true;
                }
            });

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
                    return Math.floor(newValue / 1000) + " k";
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

        vm.bind = function () {
            $(window).resize(vm.checkPageWidth);
        };

        vm.checkPageWidth = function () {
            var pWidth = window.innerWidth;

            if (pWidth > 414) {
                console.log('not mobile ');
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
})();
//# sourceMappingURL=concat.js.map
