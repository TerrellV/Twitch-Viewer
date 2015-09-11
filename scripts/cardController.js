(function() {

    angular.module('myApp')
        .controller('cardsCtrl', cardsCtrl);

    function cardsCtrl($scope, getTwitchData, $http, $q, menuService) {

        // seting variable to correct context of this
        var vm = this;
        // array for each card object to be pushed to
        vm.channels = {
            online: [],
            offline: []
        }
        // init values
        vm.service = menuService;



        const promises = getTwitchData.async();

        let P = $q.all(promises).then( response => {

            response.map( obj => {
            // if error
            if (obj.data.error) {return obj.data.message}
            // destructure object
            const { data, data: {stream} } = obj;
            // if online
            if (stream) {
                const { channel } = stream,
                { display_name:name, game , status } = channel,
                 parsedInfo = setDataOnline(stream);
                 vm.channels.online.push(parsedInfo);
              } else {
                // if offline
                const {_links:{channel:url}} = data;
                getTwitchData.getChannel(url)
                    .then( data => {
                        // send data into function to be parsed and set to card
                        const parsedInfo = setDataOffline(data.data);
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
            let ci = SetDataBoth(data);
            ci.live = false;
            ci.game = 'Offline';
            ci.frontAction = 'Go to channel';
            return ci;
        }
        $scope.live = true;
        function setDataOnline(stream) {
            // channel object later used for ng repeat
            const { channel, live, game, viewers, preview:{large:large} } = stream;

            let ci = SetDataBoth(channel);

            ci.live = true;
            ci.game = game;
            ci.viewers = abbreviateNumber(viewers);
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
        function setCardView(onlineBool, offlineBool){
            // ng show true or false for both
            vm.showOnline = onlineBool;
            vm.showOffline = offlineBool;
        }

        /*
         * further manipulate certain data...
         */

        function abbreviateNumber(value) {
            var newValue = value.toString();

            if (value >= 1000){

                if ( value < 1000000 ){
                    return `${Math.floor(newValue / 1000)} k`;
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

        function concatDscr(str) {
            return  `${str.slice(0,30)} ...`;
        }

    }
})()
