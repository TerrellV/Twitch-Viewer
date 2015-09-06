(function(){
    angular.module('factories',[])
        .factory('getTwitchData', ['$http','$q',getTwitchData]);

        function getTwitchData($http) {

            var baseUrl = 'https://api/twitch.tv/kraken';
            // this url does not work
            var url = 'https://api.twitch.tv/kraken/channels/luxxbunny?callback=JSON_CALLBACK'
            var urlTwo = 'https://api.twitch.tv/kraken/channels/kittyplaysgames?callback=JSON_CALLBACK'


            var obj = {
                async: function(){
                    var promise = $http.jsonp(urlTwo)
                        .then(function(data){
                            // console.log('success',data);
                            return data;
                        });
                    return promise;
                }
            };


            return obj;
        }

})()
