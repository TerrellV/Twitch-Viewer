'use strict';

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
                            console.log('repeat channel found in default list \n--- ' + channel + ' ---');
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
//# sourceMappingURL=factory.js.map
