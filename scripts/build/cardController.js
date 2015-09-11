'use strict';

(function () {

    angular.module('myApp').controller('cardsCtrl', cardsCtrl);

    function cardsCtrl($scope, getTwitchData, $http, $q, menuService) {

        // seting variable to correct context of this
        var vm = this;
        // array for each card object to be pushed to
        vm.channels = {
            online: [],
            offline: []
        };
        // init values
        vm.service = menuService;

        var promises = getTwitchData.async();

        var P = $q.all(promises).then(function (response) {

            response.map(function (obj) {
                // if error
                if (obj.data.error) {
                    return obj.data.message;
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
                    var parsedInfo = setDataOnline(stream);
                    vm.channels.online.push(parsedInfo);
                } else {
                    // if offline
                    var url = data._links.channel;

                    getTwitchData.getChannel(url).then(function (data) {
                        // send data into function to be parsed and set to card
                        var parsedInfo = setDataOffline(data.data);
                        vm.channels.offline.push(parsedInfo);
                        console.log('loading finished');
                    });
                }
            });
        });

        /*
         * data manipulation parese response json object
         */
        function setDataOffline(data) {
            // channel object later used for ng repeat
            var ci = SetDataBoth(data);
            ci.live = false;
            ci.game = 'Offline';
            ci.frontAction = 'Go to channel';
            return ci;
        }
        $scope.live = true;
        function setDataOnline(stream) {
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
        }
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
        function setCardView(onlineBool, offlineBool) {
            // ng show true or false for both
            vm.showOnline = onlineBool;
            vm.showOffline = offlineBool;
        }

        /*
         * further manipulate certain data...
         */

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

        function concatDscr(str) {
            return str.slice(0, 30) + ' ...';
        }
    }
})();
//# sourceMappingURL=cardController.js.map
