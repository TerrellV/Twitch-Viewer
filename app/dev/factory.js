(function() {
  angular.module('factories', []).factory('getTwitchData', ['$http', '$q', getTwitchData]).factory('setCardButton', setCardButton);

  function getTwitchData($http, $q) {

    var baseUrl = 'https://api/twitch.tv/kraken';
    var defChannels = [
      'kittyplays',
      'twosync',
      'krzjn',
      'kaypealol',
      'mrgoldensports',
      'sodapoppin',
      'femsteph',
      'riotgames',
      "LIRIK",
      'Nick_28T',
      'fifaRalle',
      'DBadaev',
      'bibaboy',
      'aimzAtchu',
      'BreaK71',
      'StreamerHouse',
      'monstercat'
    ];

    const streamURL = 'https://api.twitch.tv/kraken/streams/';
    const channelURL = 'https://api.twitch.tv/kraken/channels/';
    const callBack = '?callback=JSON_CALLBACK';

    const requestConfig = {
      headers: {
        'Client-ID': '8ma29b6x4tcnzm15446uxc3z5fjj6t'
      }
    };

    const obj = {
      async: function() {
        let promises = [];
        const completed = [];
        setPromises();

        // make a request for each channel with a promise
        function setPromises() {
          defChannels.map(channel => {
            if (completed.indexOf(channel) === -1) {
              const promise = $http.get(streamURL + channel, requestConfig).then(data => {
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
      getChannel: function(str) { // passing in entire link
        return $http.get(str, requestConfig).then(data => {
          return data;
        });
      },
      getStream: function(profName) { // passing in entire link
        return $http.get(streamURL + profName, requestConfig).then(data => {
          return data;
        });
      }
    };
    return obj;
  }

  function setCardButton() {

    const obj = {
      centerButton: function() {}
    }

    return obj;
  }

})();
