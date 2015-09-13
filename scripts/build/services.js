'use strict';

(function () {
    angular.module('myApp').service('menuService', menuService).service('popupService', popupService).service('parseDataService', parseDataService);

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
                    return Math.floor(newValue / 1000) + ' k';
                } else {
                    var n = newValue / 1000000;
                    var s = n.toString();
                    n = s.slice(0, s.indexOf('.') + 2) + 'm';
                    if (n.slice(2, -1) === '0') {
                        return n.slice(0, 1) + 'm';
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
            return str.slice(0, 30) + ' ...';
        }
    }
})();
//# sourceMappingURL=services.js.map
