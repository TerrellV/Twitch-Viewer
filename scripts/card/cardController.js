(function() {
    angular.module('myApp')
        .controller('cardsCtrl', cardsCtrl);

    function cardsCtrl($scope, getTwitchData) {

        // setting stuff
        var vm = this;
        // use service to grab http info
        var promiseArr = getTwitchData.async();

        // set array for ng repeat;
        vm.channels = [
            //empty until request finish;
        ];

        /*
         * Make channel request for each channel
         */
        promiseArr.map(function(arr) {

            return arr[1].then(function(data) {
                // check if chanel exists
                if (data.data.error !== undefined) {
                    return 'error';
                } else {
                    // check if channel is offline/online
                    if (data.data.stream === null) {
                        return [true];
                    } else {
                        console.log(arr[0]);
                        setViewOnline();
                        return [setDataOnline(data.data),false];
                    };
                }

            }).then(function( cardArr ) {
                if (cardArr === 'error' ){
                    console.log(arr[0],'channel doesnt exist');
                    // push a special object to array
                    return 'error';
                }
                // if chanel exists and ONLINE push channel
                else if  ( cardArr[1] === false ){
                    vm.channels.push(cardArr[0]);
                    return cardArr;
                } else if(cardArr[0] === true){
                    // chanel is offline make request
                    getTwitchData.getChannel(arr[0])
                        .then(function(data){
                            var channelInfo = setDataOffline(data.data);
                            vm.channels.push(channelInfo);
                            setViewOffline();
                        });
                    return cardArr;
                }
            })
        });


        /*
         * data manipulation to get info I want
         */
        function setDataOffline(data) {
            // channel object later used for ng repeat
            var ci = SetDataBoth(data);
            ci.live = false;
            return ci;
        }
        $scope.live = true;
        function setDataOnline(data) {
            // channel object later used for ng repeat
            var ci = SetDataBoth(data.stream.channel);
            sO = data.stream;
            ci.live = true;
            ci.game = sO.game;
            ci.viewers = abbreviateNumber(sO.viewers);
            ci.previewImg = sO.preview.large;
            ci.strmDscr = sO.channel.status;
            ci.frontSubtitel = 'Watch Now';
            ci.streamLabel = 'Live';
            return ci;
        }
        function SetDataBoth(data){
            // channel object later used for ng repeat
            var ci = {}
            ci.profileName = data.display_name;
            ci.followers = abbreviateNumber(data.followers);
            ci.url = data.url;
            ci.frontSubtitel = 'Offline';
            ci.streamLabel = 'Offline';


            return ci;
        }
        function setViewOnline(){
            // update controller and update view
            // NOTE: view not updating on either of these
        }
        function setViewOffline(){
            // update controller and update view
        }


        /*
         * further manipulate certain data...
         */

        function abbreviateNumber(value) {
            var newValue = value.toString();

            if (value >= 1000){
                var suffixes = ['k','m'];
                if ( value < 1000000 ){
                    return Math.floor(newValue / 1000) + 'k';
                }
                else {
                    var n = newValue / 1000000;
                    var s = n.toString();
                    n = s.slice(0, s.indexOf('.')+2) + 'm';
                    if(n.slice(2,-1) === '0'){
                        return n.slice(0,1)+'m';
                    } else return n;
                }
            }
            return newValue;
        }

    }
})()
