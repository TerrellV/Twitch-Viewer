'use strict';

(function () {

    angular.module('myApp').controller('cardsCtrl', cardsCtrl);

    function cardsCtrl($scope, getTwitchData, $http, $q) {

        // setting stuff
        var vm = this;
        // use service to grab http info
        var promiseArr = getTwitchData.async();

        // set array for ng repeat;
        vm.channels = [
            //empty until request finish;
        ];

        var strictPromiseArr = promiseArr.map(function (a) {
            return a.pop();
        });

        var promiseArr = getTwitchData.async();

        var P = $q.all(strictPromiseArr).then(function (response) {
            var channelPromises = [];
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
                    vm.channels.push(parsedInfo);
                } else {
                    // if offline
                    var url = data._links.channel;

                    getTwitchData.getChannel(url).then(function (data) {
                        // send data into function to be parsed and set to card
                        var parsedInfo = setDataOffline(data.data);
                        vm.channels.push(parsedInfo);
                    });
                }
            });
            console.log('finished waiting');
        });

        /*
         * Make channel request for each channel
         */

        // promiseArr.map(function(arr) {
        //
        //     // arr 0 === name of channel arr 1 is promise
        //     return arr[1].then(function(data) {
        //         // check if chanel exists
        //         if (data.data.error !== undefined) {
        //             return 'error';
        //         } else {
        //             // check if channel is offline/online
        //             if (data.data.stream === null) {
        //                 return [true];
        //             } else {
        //                 setViewOnline();
        //                 // return [setDataOnline(data.data),false];
        //             };
        //         }
        //
        //     }).then(function( cardArr ) {
        //         if (cardArr === 'error' ){
        //             console.log(arr[0],'channel doesnt exist');
        //             // push a special object to array for ^
        //             return 'error';
        //         }
        //         // if chanel exists and ONLINE push channel
        //         else if  ( cardArr[1] === false ){
        //             vm.channels.push(cardArr[0]);
        //             return cardArr;
        //         } else if(cardArr[0] === true){
        //             // chanel is offline make request
        //             // getTwitchData.getChannel(arr[0])
        //             //     .then( data => {
        //             //         const channelInfo = setDataOffline(data.data);
        //             //         vm.channels.push(channelInfo);
        //             //         setViewOffline();
        //             //     });
        //             // return cardArr;
        //         }
        //     })
        // });

        /*
         * data manipulation to get info I want
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

            return {
                name: name,
                followers: abbreviateNumber(followers),
                url: url,
                status: concatDscr(status)
            };
        }
        function setViewOnline() {}
        function setViewOffline() {}

        /*
         * further manipulate certain data...
         */

        function abbreviateNumber(value) {
            var newValue = value.toString();

            if (value >= 1000) {
                var suffixes = ['k', 'm'];
                if (value < 1000000) {
                    return Math.floor(newValue / 1000) + 'k';
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
