(function() {
    angular.module('myApp', ["ngAnimate","factories","ngRoute"]);
})();

(() => {
    angular.module('myApp')
        .controller('popupController', ['$scope', 'popupService', 'getTwitchData', 'parseDataService', '$q', popupController])
        .directive('addcardDir',addcardDir );

        function popupController($scope, popupService, getTwitchData, parseDataService, $q) {
            const vm = this;
            vm.service = popupService;
            vm.showPopup = popupService.showPopup;
            vm.instructionText = "start typing...";
            vm.checkEnter = (event, input) => {
                if (event.charCode === 13 ) {
                    vm.makeRequest(input);
                }
            }


            // passing input value to service to make httpRequest
            vm.makeRequest = stream => {
                if (stream.length > 1 ) {
                    getTwitchData.getStream( stream )
                        .then(response => {
                            vm.userText="";
                            const res = parseDataService.checkOnline(response);
                            // this response needs to be a promise even if...
                            // the response is not; i.e if stream is online;
                            $q.when(res).then(function(data){
                                if (data.duplicate) {
                                    animateErrorResponse(stream, data);
                                }
                                if (data.valid){
                                    animateSuccessResponse();
                                } else {
                                    animateErrorResponse(stream, data);
                                }
                            })
                        }, reason => {
                            console.log(`${stream} not a valid channel`);
                            vm.userText="";
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
            function animateErrorResponse ( enteredString, reason ){
                if(reason.duplicate) {
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

                const timeout = window.setTimeout(()=>{
                    addIcon.style.opacity = "1";
                    errorIcon.parentNode.replaceChild(newGroup,errorIcon);
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
                templateUrl: 'app/build/script/Add-Card/addCard.html',
                link: (scope, element, attr, ctrl) => {

                }
            }
        }
})();

(function() {

    angular.module('myApp')
        .controller('cardsCtrl', ['$scope','$http','$q','getTwitchData','menuService','setCSS','parseDataService', cardsCtrl]);

    function cardsCtrl($scope, $http, $q, getTwitchData, menuService, setCSS, parseDataService) {

        // seting variable to correct context of this
        const vm = this;
        // array for each card object to be pushed to
        vm.channels = parseDataService.channels;
        // init values
        vm.service = menuService;
        // working working working... testing watch and grunt on save
        const css = setCSS;
        css.checkPageWidth();
        css.bind();

        // set position of search
        const $p = $('.pageContent');
        const search = $p.find('.search-container');
        const grid = $p.find('.live-card-grid');
        const width = $('.live-card-grid').width();
        search.css({
          "width": `${width - 40}` // 40 equates for the padding of the cards
        });


    }
})();

(function(){
    angular.module('myApp')
        .directive('myDir', ['$timeout','$interval',dirSample]);

    // custom directie to keep track of dom elements of individual cards...
    function dirSample($interval,$timeout) {
        return {
            templateUrl: 'app/build/script/Channel-Card/cardContent.html',
            scope: {
                channel: '=',
                appear: '=',
                toggle: '=',
                showBack: '='
            },
            link: function(scope, element, attributes){
                // grab all necesssary variables for elemnts in card
                var header = element.find('#head'),

                    frontButton = element.find('.subhead-btn'),
                    personIcon = frontButton.children(),
                    exitButton = element.find('#info-close-btn');


            /*
              * opening and closing more info
            */

                // animate front button to fill and then fade out
                frontButton.bind("click", () => {
                    scope.showBack = true;
                    frontButton.addClass("animate-fill");
                    personIcon.addClass('animate-hide');
                    const id = window.setTimeout(showInfo,800);
                    function showInfo(){
                        scope.appear = true;
                        scope.$apply();
                        const id = window.setTimeout(function () {
                            frontButton.removeClass("animate-fill");
                            personIcon.removeClass('animate-hide');
                        }, 200);
                    }
                });
                // animate closing of info pannel
                exitButton.bind('click',() => {
                    scope.showBack = false;
                    scope.appear = false;
                    frontButton.addClass('animate-fill-backwards');
                    personIcon.addClass('animate-show');

                    const id = window.setTimeout(()=> {
                        frontButton.removeClass('animate-fill-backwards');
                        personIcon.removeClass('animate-show');
                    }, 800);

                    scope.$apply();
                });

                /*
                  * sliding between stream/followers slides
                */



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

(function(){
    angular.module('myApp')
        .directive('navDir', ['$timeout','$interval',navDir]);

        function navDir() {
            return {
                templateUrl: 'app/build/script/Navigation/nav.html',
                controller: 'navController',
                link: function(scope,element,attr) {

                  var tabAll = element.find('#tab-all'),
                      tabOnline = element.find("#tab-online"),
                      tabOffline = element.find("#tab-offline");

                  init('all'); //starting tab to show

                  function init(str){
                    scope.activeTab = str;
                  }

                  tabAll.bind('click', function(){
                    scope.activeTab = 'all';
                    scope.$apply();
                  });
                  tabOnline.bind('click', function(){
                    scope.activeTab = 'online';
                    scope.$apply();
                  });
                  tabOffline.bind('click', function(){
                    scope.activeTab = 'offline';
                    scope.$apply();
                  });

                }
            }
        }

})();

(function() {
    angular.module('factories', [])
        .factory('getTwitchData', ['$http', '$q', getTwitchData]);

    function getTwitchData($http,$q) {

        var baseUrl = 'https://api/twitch.tv/kraken';
        var defChannels = ['comster404','freecodecamp','kittyplaysgames','twosync','freecodecamp','krzjn', 'kaypealol', 'mrgoldensports', 'vgbootcamp', 'sodapoppin', 'femsteph', 'streamerhouse', 'joshog', 'pgl'];

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

})();

(()=>{
    angular.module('myApp')
        .service('menuService',menuService)
        .service('popupService',popupService)
        .service('parseDataService',parseDataService)
        .service('setCSS',setCSS);

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

        function parseDataService(getTwitchData, $q) {

            const vm = this;
            const promises = getTwitchData.async();

        /*
         * Arrays to hows parsed card data used in templates
        */
            vm.channels = {
                online: [],
                offline: []
            }

        /*
         * Map and request stream and or channel for each
        */
            let P = $q.all(promises).then( response => {
                response.map( vm.checkOnline );
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
                     vm.channels.online.push(parsedInfo);
                     return {valid:true} ;
                  }
                else {
                    // if offline
                    const {_links:{channel:url}} = data;
                    return getTwitchData.getChannel(url)
                        .then( data => {
                            // Parese Data for cards
                            const parsedInfo = vm.setDataOffline(data.data);
                            if ( !checkDuplicates(parsedInfo) ){
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
                ci.game = game;
                ci.viewers = abbreviateNumber(viewers);
                console.log('live viewers',ci.viewers);
                ci.previewImg = large;
                ci.strmDscr = concatDscr(status);
                ci.frontAction = 'Watch Now';
                return ci;
            }
            function SetDataBoth(channel){
                // channel object later used for ng repeat
                const { display_name:name, followers, url, status } = channel;
                // construct object using const variables above
                return {
                    name,
                    followers: abbreviateNumber(followers),
                    url,
                    status: concatDscr(status)
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

                allChannels.map(function compare( newChannelObj ) {
                    const {name:existingName} = newChannelObj;
                    if(name.toLowerCase() === existingName.toLowerCase()) {
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
            function concatDscr(str) {
                if (str === null) {return ''}
                return  `${str.slice(0,30)} ...`;
            }
        }
        function setCSS() {
            const vm = this;
            const page = $(".pageContent");

            vm.bind = function() {
                $( window ).resize( vm.checkPageWidth );
            }

            vm.checkPageWidth = function() {
                const pWidth = window.innerWidth;
                console.log(pWidth);

                if (pWidth > 414) {
                  console.log('not mobile ');
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
})();
