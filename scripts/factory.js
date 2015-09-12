(function() {
    angular.module('factories', [])
        .factory('getTwitchData', ['$http', '$q', getTwitchData]);

    function getTwitchData($http,$q) {

        var baseUrl = 'https://api/twitch.tv/kraken';
        var defChannels = ['comster404','freecodecamp','kittyplaysgames','twosync'];
        var otherChannels = ['krzjn', 'kaypealol','mrgoldensports','vgbootcamp','sodapoppin','femsteph', 'streamerhouse','joshog','pgl']

        const url = 'https://api.twitch.tv/kraken/streams/';
        const channelUrl = 'https://api.twitch.tv/kraken/channels/';
        const callBack = '?callback=JSON_CALLBACK';

        const obj = {
            async: function() {
                let promises = [];
                setPromises();

                // make a request for each channel with a promise
                function setPromises() {
                    defChannels.map(channel => {
                        const promise = $http.jsonp(url+channel+callBack)
                            .then(data => {
                                return data;
                            });
                        promises.push(promise);
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

})()
